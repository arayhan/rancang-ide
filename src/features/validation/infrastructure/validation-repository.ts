import { desc, eq } from "drizzle-orm";

import { getDb } from "@/shared/infrastructure/db";

import { validations } from "../../../../drizzle/schema";
import type { ValidationResult, Verdict } from "../domain/schema";

export type SaveValidationInput = {
  projectId: string;
  verdict: Verdict;
  report: ValidationResult;
  modelUsed: string;
};

/** Persist a completed validation report. */
export async function saveValidation(input: SaveValidationInput): Promise<void> {
  await getDb().insert(validations).values({
    projectId: input.projectId,
    verdict: input.verdict,
    report: input.report,
    modelUsed: input.modelUsed,
  });
}

/** The most recent validation report for a project, or null. */
export async function getLatestValidation(
  projectId: string,
): Promise<ValidationResult | null> {
  const [row] = await getDb()
    .select({ report: validations.report })
    .from(validations)
    .where(eq(validations.projectId, projectId))
    .orderBy(desc(validations.createdAt))
    .limit(1);
  return row ? (row.report as ValidationResult) : null;
}
