import { generations } from "../../../drizzle/schema";
import { getDb } from "./db";

export type GenerationStage = "validation" | "structure" | "prd" | "tasks";

export type LogGenerationInput = {
  userId: string;
  projectId: string | null;
  stage: GenerationStage;
  model: string;
  inputTokens?: number | null;
  outputTokens?: number | null;
};

/** Append one usage row to `generations` (cost & quota tracking). */
export async function logGeneration(input: LogGenerationInput): Promise<void> {
  await getDb()
    .insert(generations)
    .values({
      userId: input.userId,
      projectId: input.projectId ?? null,
      stage: input.stage,
      model: input.model,
      inputTokens: input.inputTokens ?? null,
      outputTokens: input.outputTokens ?? null,
    });
}
