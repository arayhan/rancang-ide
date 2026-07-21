import { markdownDocSchema, type MarkdownDoc } from "../domain/schema";

/** Validate raw AI markdown-doc output. Throws ZodError if off-contract. */
export function parseMarkdownDoc(raw: unknown): MarkdownDoc {
  return markdownDocSchema.parse(raw);
}
