import type { GeneratedTasks, TasksDocument } from "./schema";

/** Assign ids and default `done: false` to freshly generated tasks. Pure. */
export function assignTaskIds(
  generated: GeneratedTasks,
  idGen: () => string,
): TasksDocument {
  return {
    tasks: generated.tasks.map((task) => ({
      id: idGen(),
      title: task.title,
      description: task.description,
      done: false,
    })),
  };
}

/** Toggle a task's done state (immutable). */
export function toggleTask(doc: TasksDocument, id: string): TasksDocument {
  return {
    tasks: doc.tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task,
    ),
  };
}
