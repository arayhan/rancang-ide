import { z } from "zod";

export const projectStatusSchema = z.enum([
  "draft",
  "validated",
  "structured",
  "spec_ready",
]);

/** Free-form per-project context (target user, notes). Persisted as jsonb. */
export const projectContextSchema = z.record(z.string(), z.unknown());

/** Input contract for POST /api/projects. `context` is optional. */
export const createProjectInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  ideaInput: z
    .string()
    .trim()
    .min(10, "Describe your idea in at least a sentence.")
    .max(10_000),
  context: projectContextSchema.nullish(),
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;
