import { NextResponse, type NextRequest } from "next/server";

import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { getUserPlan } from "@/features/auth/infrastructure/profile";
import { getProject } from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { streamValidation } from "@/features/validation/infrastructure/validation-ai";
import { saveValidation } from "@/features/validation/infrastructure/validation-repository";
import { parseModelTier } from "@/shared/domain/model";
import { isOverProjectQuota } from "@/shared/domain/quota";
import { modelIdFor } from "@/shared/infrastructure/ai";
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

  // Quota is checked BEFORE spending any AI tokens.
  const [plan, projectCount] = await Promise.all([
    getUserPlan(userId),
    projectRepo.countByUser(userId),
  ]);
  if (isOverProjectQuota(plan, projectCount)) {
    return NextResponse.json({ error: "quota_exceeded" }, { status: 402 });
  }

  const tier = parseModelTier(body?.model);
  const model = modelIdFor(tier);

  const result = streamValidation(
    { idea: project.ideaInput, context: project.context, tier },
    async ({ object, usage, error }) => {
      // Always log the attempt for cost tracking.
      await logGeneration({
        userId,
        projectId,
        stage: "validation",
        model,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
      });
      // Never persist output that failed schema validation.
      if (error || !object) return;
      await saveValidation({
        projectId,
        verdict: object.verdict,
        report: object,
        modelUsed: model,
      });
      await projectRepo.updateStatus(projectId, userId, "validated");
    },
  );

  return result.toTextStreamResponse();
}
