import { streamObject } from "ai";

import type { ModelTier } from "@/shared/domain/model";
import { getModel } from "@/shared/infrastructure/ai";

import { buildValidationPrompt, VALIDATION_SYSTEM_PROMPT } from "../domain/prompt";
import { validationResultSchema } from "../domain/schema";

export type StreamValidationParams = {
  idea: string;
  context: Record<string, unknown> | null;
  tier: ModelTier;
};

/**
 * Stream a validation report from the model as a structured object.
 * The caller consumes the stream and, on finish, validates + persists.
 */
export function streamValidation(params: StreamValidationParams) {
  return streamObject({
    model: getModel(params.tier),
    schema: validationResultSchema,
    system: VALIDATION_SYSTEM_PROMPT,
    prompt: buildValidationPrompt(params.idea, params.context),
  });
}
