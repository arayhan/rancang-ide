import { streamObject, type LanguageModelUsage } from "ai";

import { languageInstruction, type Language } from "@/shared/domain/language";
import type { ModelTier } from "@/shared/domain/model";
import { getModel } from "@/shared/infrastructure/ai";

import { buildValidationPrompt, VALIDATION_SYSTEM_PROMPT } from "../domain/prompt";
import { validationResultSchema, type ValidationResult } from "../domain/schema";

export type StreamValidationParams = {
  idea: string;
  context: Record<string, unknown> | null;
  tier: ModelTier;
  language: Language;
};

/** What the caller needs from a finished stream: the object (or undefined if
 * it failed schema validation), token usage, and any error. */
export type ValidationFinishEvent = {
  object: ValidationResult | undefined;
  usage: LanguageModelUsage;
  error: unknown;
};

/**
 * Stream a validation report from the model as a structured object.
 * `onFinish` fires once with the final object + token usage so the caller can
 * persist + log.
 */
export function streamValidation(
  params: StreamValidationParams,
  onFinish?: (event: ValidationFinishEvent) => Promise<void> | void,
) {
  return streamObject({
    model: getModel(params.tier),
    schema: validationResultSchema,
    system: `${VALIDATION_SYSTEM_PROMPT}\n\n${languageInstruction(params.language)}`,
    prompt: buildValidationPrompt(params.idea, params.context),
    onFinish,
  });
}
