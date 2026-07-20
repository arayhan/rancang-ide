import { streamObject, type LanguageModelUsage } from "ai";

import type { ModelTier } from "@/shared/domain/model";
import { getModel } from "@/shared/infrastructure/ai";

import { buildStructurePrompt, STRUCTURE_SYSTEM_PROMPT } from "../domain/prompt";
import { generatedTreeSchema, type GeneratedTree } from "../domain/schema";

export type StreamStructureParams = {
  idea: string;
  context: Record<string, unknown> | null;
  validationSummary?: string;
  tier: ModelTier;
};

export type StructureFinishEvent = {
  object: GeneratedTree | undefined;
  usage: LanguageModelUsage;
  error: unknown;
};

/** Stream a feature tree from the model as a structured object. */
export function streamStructure(
  params: StreamStructureParams,
  onFinish?: (event: StructureFinishEvent) => Promise<void> | void,
) {
  return streamObject({
    model: getModel(params.tier),
    schema: generatedTreeSchema,
    system: STRUCTURE_SYSTEM_PROMPT,
    prompt: buildStructurePrompt(params.idea, params.context, params.validationSummary),
    onFinish,
  });
}
