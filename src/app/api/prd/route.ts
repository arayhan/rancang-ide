import { NextResponse, type NextRequest } from "next/server";

import { getUserPlan } from "@/features/auth/infrastructure/profile";
import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { getProject } from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { streamPrd } from "@/features/prd/infrastructure/prd-ai";
import { savePrd } from "@/features/prd/infrastructure/prd-repository";
import { parseModelTier } from "@/shared/domain/model";
import { isOverProjectQuota } from "@/shared/domain/quota";
import { modelIdFor } from "@/shared/infrastructure/ai";
import { getDocument } from "@/shared/infrastructure/documents";
import { logGeneration } from "@/shared/infrastructure/generations";
import { rateLimit } from "@/shared/infrastructure/ratelimit";

const projectRepo = new DrizzleProjectRepository();

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const limit = rateLimit(`gen:${userId}`);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
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

  // The PRD is generated from the curated feature tree.
  const treeDoc = await getDocument(projectId, "tree");
  if (!treeDoc) {
    return NextResponse.json({ error: "tree_required" }, { status: 409 });
  }

  const [plan, projectCount] = await Promise.all([
    getUserPlan(userId),
    projectRepo.countByUser(userId),
  ]);
  if (isOverProjectQuota(plan, projectCount)) {
    return NextResponse.json({ error: "quota_exceeded" }, { status: 402 });
  }

  const tier = parseModelTier(body?.model);
  const model = modelIdFor(tier);

  const result = streamPrd(
    { idea: project.ideaInput, treeJson: JSON.stringify(treeDoc.content), tier },
    async ({ object, usage, error }) => {
      await logGeneration({
        userId,
        projectId,
        stage: "prd",
        model,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
      });
      if (error || !object) return;
      await savePrd(projectId, object, model);
    },
  );

  return result.toTextStreamResponse();
}
