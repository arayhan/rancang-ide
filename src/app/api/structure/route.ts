import { NextResponse, type NextRequest } from "next/server";

import { getUserPlan } from "@/features/auth/infrastructure/profile";
import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { getProject } from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { assignTreeIds } from "@/features/structure/domain/tree";
import { streamStructure } from "@/features/structure/infrastructure/structure-ai";
import { getLatestValidation } from "@/features/validation/infrastructure/validation-repository";
import { parseModelTier } from "@/shared/domain/model";
import { isOverProjectQuota } from "@/shared/domain/quota";
import { modelIdFor } from "@/shared/infrastructure/ai";
import { upsertDocument } from "@/shared/infrastructure/documents";
import { logGeneration } from "@/shared/infrastructure/generations";

const projectRepo = new DrizzleProjectRepository();

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    project_id?: string;
    model?: string;
  } | null;
  const projectId = body?.project_id;
  if (!projectId) {
    return NextResponse.json({ error: "project_id_required" }, { status: 400 });
  }

  const project = await getProject(projectRepo, userId, projectId);
  if (!project) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const [plan, projectCount] = await Promise.all([
    getUserPlan(userId),
    projectRepo.countByUser(userId),
  ]);
  if (isOverProjectQuota(plan, projectCount)) {
    return NextResponse.json({ error: "quota_exceeded" }, { status: 402 });
  }

  // Ground the tree in the latest validation, if one exists.
  const validation = await getLatestValidation(projectId);
  const validationSummary = validation
    ? `Verdict: ${validation.verdict}. ${validation.verdict_summary} Core assumption: ${validation.core_assumption}`
    : undefined;

  const tier = parseModelTier(body?.model);
  const model = modelIdFor(tier);

  const result = streamStructure(
    { idea: project.ideaInput, context: project.context, validationSummary, tier },
    async ({ object, usage, error }) => {
      await logGeneration({
        userId,
        projectId,
        stage: "structure",
        model,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
      });
      if (error || !object) return;
      const tree = assignTreeIds(object, () => crypto.randomUUID());
      await upsertDocument({ projectId, type: "tree", content: tree, modelUsed: model });
      await projectRepo.updateStatus(projectId, userId, "structured");
    },
  );

  return result.toTextStreamResponse();
}
