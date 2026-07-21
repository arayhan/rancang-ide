import { getDocument, upsertDocument } from "@/shared/infrastructure/documents";

import type { DocType } from "../domain/doc-config";
import type { MarkdownDoc } from "../domain/schema";

/** Persist (replace) a generated document of the given type for a project. */
export async function saveDoc(
  projectId: string,
  type: DocType,
  doc: MarkdownDoc,
  modelUsed: string,
): Promise<void> {
  await upsertDocument({ projectId, type, content: doc, modelUsed });
}

/** Load a stored document (with id + model) for a project + type, or null. */
export async function getDoc(
  projectId: string,
  type: DocType,
): Promise<{ id: string; doc: MarkdownDoc; modelUsed: string | null } | null> {
  const row = await getDocument(projectId, type);
  return row
    ? { id: row.id, doc: row.content as MarkdownDoc, modelUsed: row.modelUsed }
    : null;
}
