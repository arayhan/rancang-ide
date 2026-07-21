import { and, eq, sql } from "drizzle-orm";

import { documents, projects } from "../../../drizzle/schema";
import { getDb } from "./db";

export type DocumentType =
  | "tree"
  | "prd"
  | "tasks"
  | "brd"
  | "database_design"
  | "system_design";

export type StoredDocument = { id: string; content: unknown; modelUsed: string | null };

export type UpsertDocumentInput = {
  projectId: string;
  type: DocumentType;
  content: unknown;
  modelUsed?: string | null;
};

/**
 * Insert or replace the current document of a type for a project. Bumps the
 * version on replace. One row per (project, type) — other types are untouched.
 */
export async function upsertDocument(input: UpsertDocumentInput): Promise<void> {
  await getDb()
    .insert(documents)
    .values({
      projectId: input.projectId,
      type: input.type,
      content: input.content,
      modelUsed: input.modelUsed ?? null,
    })
    .onConflictDoUpdate({
      target: [documents.projectId, documents.type],
      set: {
        content: input.content,
        modelUsed: input.modelUsed ?? null,
        version: sql`${documents.version} + 1`,
        updatedAt: new Date(),
      },
    });
}

/** Read the current document of a type for a project (with its id), or null. */
export async function getDocument(
  projectId: string,
  type: DocumentType,
): Promise<StoredDocument | null> {
  const [row] = await getDb()
    .select({
      id: documents.id,
      content: documents.content,
      modelUsed: documents.modelUsed,
    })
    .from(documents)
    .where(and(eq(documents.projectId, projectId), eq(documents.type, type)))
    .limit(1);
  return row ?? null;
}

/**
 * Update a document's content by id, but only if the caller owns the parent
 * project (the Drizzle connection bypasses RLS, so ownership is checked here).
 * Returns false if nothing matched.
 */
export async function updateDocumentContent(
  id: string,
  userId: string,
  content: unknown,
): Promise<boolean> {
  const rows = await getDb()
    .update(documents)
    .set({ content, updatedAt: new Date() })
    .where(
      and(
        eq(documents.id, id),
        sql`exists (select 1 from ${projects} where ${projects.id} = ${documents.projectId} and ${projects.userId} = ${userId})`,
      ),
    )
    .returning({ id: documents.id });
  return rows.length > 0;
}
