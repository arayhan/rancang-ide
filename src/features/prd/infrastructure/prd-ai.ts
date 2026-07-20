import { streamObject, type LanguageModelUsage } from "ai";

import type { ModelTier } from "@/shared/domain/model";
import { getModel } from "@/shared/infrastructure/ai";

import { buildPrdPrompt, PRD_SYSTEM_PROMPT } from "../domain/prompt";
import { prdDocumentSchema, type PrdDocument } from "../domain/schema";

export type StreamPrdParams = {
  idea: string;
  treeJson: string;
  tier: ModelTier;
};

export type PrdFinishEvent = {
  object: PrdDocument | undefined;
  usage: LanguageModelUsage;
  error: unknown;
};

/** Stream a PRD document from the model as a structured object. */
export function streamPrd(
  params: StreamPrdParams,
  onFinish?: (event: PrdFinishEvent) => Promise<void> | void,
) {
  return streamObject({
    model: getModel(params.tier),
    schema: prdDocumentSchema,
    system: PRD_SYSTEM_PROMPT,
    prompt: buildPrdPrompt(params.idea, params.treeJson),
    onFinish,
  });
}
