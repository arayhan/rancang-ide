/** Billing plan (pure, mirrors the profiles.plan enum). */
export type Plan = "free" | "pro";

/** Free users may keep up to this many active projects. */
export const FREE_PROJECT_LIMIT = 3;

/**
 * Whether a user is over their project quota. Free users are capped at
 * FREE_PROJECT_LIMIT; pro users are unlimited. Checked before spending AI.
 */
export function isOverProjectQuota(
  plan: Plan,
  activeProjectCount: number,
  limit: number = FREE_PROJECT_LIMIT,
): boolean {
  return plan === "free" && activeProjectCount > limit;
}
