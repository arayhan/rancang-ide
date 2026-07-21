import { NextResponse, type NextRequest } from "next/server";

import { getUserPlan } from "@/features/auth/infrastructure/profile";
import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { DOC_CONFIGS, isDocType } from "@/features/docs/domain/doc-config";
import { streamDoc } from "@/features/docs/infrastructure/doc-ai";
import { saveDoc } from "@/features/docs/infrastructure/doc-repository";
import { getProject } from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { getPrd } from "@/features/prd/infrastructure/prd-repository";
import { getLatestValidation } from "@/features/validation/infrastructure/validation-repository";
import { parseLanguage } from "@/shared/domain/language";
import { parseModelTier } from "@/shared/domain/model";
import { isOverProjectQuota } from "@/shared/domain/quota";
import { modelIdFor } from "@/shared/infrastructure/ai";
import { getDocument } from "@/shared/infrastructure/documents";
import { logGeneration } from "@/shared/infrastructure/generations";
import { rateLimit } from "@/shared/infrastructure/ratelimit";

const projectRepo = new DrizzleProjectRepository();

type RouteContext = { params: Promise<{ type: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
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

  const { type } = await params;
  if (!isDocType(type)) {
    return NextResponse.json({ error: "unknown_doc_type" }, { status: 404 });
  }
  const config = DOC_CONFIGS[type];

  const body = (await request.json().catch(() => null)) as {
    project_id?: string;
    model?: string;
    language?: string;
  } | null;
  const projectId = body?.project_id;
  if (!projectId) {
    return NextResponse.json({ error: "project_id_required" }, { status: 400 });
  }

  const project = await getProject(projectRepo, userId, projectId);
  if (!project) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const [prd, validation, treeDoc] = await Promise.all([
    getPrd(projectId),
    getLatestValidation(projectId),
    getDocument(projectId, "tree"),
  ]);
  if (config.requires === "prd" && !prd) {
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
  const language = parseLanguage(body?.language);
  const model = modelIdFor(tier);

  const userPrompt = config.buildPrompt({
    idea: project.ideaInput,
    context: project.context,
    validationSummary: validation
      ? `Verdict: ${validation.report.verdict}. ${validation.report.verdict_summary}`
      : undefined,
    treeJson: treeDoc ? JSON.stringify(treeDoc.content) : undefined,
    prdMarkdown: prd?.prd.markdown,
  });

  const result = streamDoc(
    { systemPrompt: config.systemPrompt, userPrompt, tier, language },
    async ({ object, usage, error }) => {
      await logGeneration({
        userId,
        projectId,
        stage: type,
        model,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
      });
      if (error || !object) return;
      await saveDoc(projectId, type, object, model);
    },
  );

  return result.toTextStreamResponse();
}
