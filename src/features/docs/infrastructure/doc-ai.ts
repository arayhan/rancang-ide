import { streamObject, type LanguageModelUsage } from "ai";

import { languageInstruction, type Language } from "@/shared/domain/language";
import type { ModelTier } from "@/shared/domain/model";
import { getModel } from "@/shared/infrastructure/ai";

import { markdownDocSchema, type MarkdownDoc } from "../domain/schema";

export type StreamDocParams = {
  systemPrompt: string;
  userPrompt: string;
  tier: ModelTier;
  language: Language;
};

export type DocFinishEvent = {
  object: MarkdownDoc | undefined;
  usage: LanguageModelUsage;
  error: unknown;
};

/** Stream a generic markdown document (BRD / DB design / system design). */
export function streamDoc(
  params: StreamDocParams,
  onFinish?: (event: DocFinishEvent) => Promise<void> | void,
) {
  return streamObject({
    model: getModel(params.tier),
    schema: markdownDocSchema,
    system: `${params.systemPrompt}\n\n${languageInstruction(params.language)}`,
    prompt: params.userPrompt,
    onFinish,
  });
}
