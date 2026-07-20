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
