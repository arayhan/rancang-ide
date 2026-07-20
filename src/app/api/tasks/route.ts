import { NextResponse, type NextRequest } from "next/server";

import { getUserPlan } from "@/features/auth/infrastructure/profile";
import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { getProject } from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { getPrd } from "@/features/prd/infrastructure/prd-repository";
import { assignTaskIds } from "@/features/tasks/domain/tasks";
import { streamTasks } from "@/features/tasks/infrastructure/tasks-ai";
import { saveTasks } from "@/features/tasks/infrastructure/tasks-repository";
import { parseModelTier } from "@/shared/domain/model";
import { isOverProjectQuota } from "@/shared/domain/quota";
import { modelIdFor } from "@/shared/infrastructure/ai";
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

  // Tasks are generated from the PRD.
  const prd = await getPrd(projectId);
  if (!prd) {
    return NextResponse.json({ error: "prd_required" }, { status: 409 });
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

  const result = streamTasks(
    { prdMarkdown: prd.prd.markdown, tier },
    async ({ object, usage, error }) => {
      await logGeneration({
        userId,
        projectId,
        stage: "tasks",
        model,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
      });
      if (error || !object) return;
      const tasks = assignTaskIds(object, () => crypto.randomUUID());
      await saveTasks(projectId, tasks, model);
      await projectRepo.updateStatus(projectId, userId, "spec_ready");
    },
  );

  return result.toTextStreamResponse();
}
