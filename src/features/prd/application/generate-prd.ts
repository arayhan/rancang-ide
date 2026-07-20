import { prdDocumentSchema, type PrdDocument } from "../domain/schema";

/** Validate raw AI PRD output. Throws ZodError if off-contract. */
export function parsePrdDocument(raw: unknown): PrdDocument {
  return prdDocumentSchema.parse(raw);
}
