import { z } from "zod";

// ── Stored shape (ids for stable keys, done for checkbox state) ───────────────

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  done: z.boolean(),
});

export const tasksDocumentSchema = z.object({
  tasks: z.array(taskSchema),
});

// ── AI generation contract (no id / done — assigned after) ────────────────────

export const generatedTaskSchema = z.object({
  title: z.string().describe("An imperative, concrete task."),
  description: z.string().optional().describe("One line of detail if useful."),
});

export const generatedTasksSchema = z.object({
  tasks: z.array(generatedTaskSchema).min(1),
});

export type Task = z.infer<typeof taskSchema>;
export type TasksDocument = z.infer<typeof tasksDocumentSchema>;
export type GeneratedTasks = z.infer<typeof generatedTasksSchema>;
