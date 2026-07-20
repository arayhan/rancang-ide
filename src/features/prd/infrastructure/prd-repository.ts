import { getDocument, upsertDocument } from "@/shared/infrastructure/documents";

import type { PrdDocument } from "../domain/schema";

/** Persist (replace) the PRD document for a project. */
export async function savePrd(
  projectId: string,
  prd: PrdDocument,
  modelUsed: string,
): Promise<void> {
  await upsertDocument({ projectId, type: "prd", content: prd, modelUsed });
}

/** Load the stored PRD (with its document id) for a project, or null. */
export async function getPrd(
  projectId: string,
): Promise<{ id: string; prd: PrdDocument } | null> {
  const doc = await getDocument(projectId, "prd");
  return doc ? { id: doc.id, prd: doc.content as PrdDocument } : null;
}
