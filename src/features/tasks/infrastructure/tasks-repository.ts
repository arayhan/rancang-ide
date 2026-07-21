import { getDocument, upsertDocument } from "@/shared/infrastructure/documents";

import type { TasksDocument } from "../domain/schema";

/** Persist (replace) the tasks document for a project. */
export async function saveTasks(
  projectId: string,
  tasks: TasksDocument,
  modelUsed: string,
): Promise<void> {
  await upsertDocument({ projectId, type: "tasks", content: tasks, modelUsed });
}

/** Load the stored tasks (with document id + model) for a project, or null. */
export async function getTasks(
  projectId: string,
): Promise<{ id: string; tasks: TasksDocument; modelUsed: string | null } | null> {
  const doc = await getDocument(projectId, "tasks");
  return doc
    ? { id: doc.id, tasks: doc.content as TasksDocument, modelUsed: doc.modelUsed }
    : null;
}
