import { generatedTreeSchema, type GeneratedTree } from "../domain/schema";

/**
 * Validate raw AI tree output against the schema. Throws ZodError if the model
 * returned something off-contract — callers must not persist invalid output.
 */
export function parseGeneratedTree(raw: unknown): GeneratedTree {
  return generatedTreeSchema.parse(raw);
}
