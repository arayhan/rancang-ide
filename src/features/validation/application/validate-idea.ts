import { validationResultSchema, type ValidationResult } from "../domain/schema";

/**
 * Validate raw AI output against the schema. Throws ZodError if the model
 * returned something off-contract — callers must not persist invalid output.
 */
export function parseValidationResult(raw: unknown): ValidationResult {
  return validationResultSchema.parse(raw);
}
