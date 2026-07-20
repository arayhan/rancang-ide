import { generatedTasksSchema, type GeneratedTasks } from "../domain/schema";

/** Validate raw AI task output. Throws ZodError if off-contract. */
export function parseGeneratedTasks(raw: unknown): GeneratedTasks {
  return generatedTasksSchema.parse(raw);
}
