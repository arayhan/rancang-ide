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

/**
 * Whether the user has hit the limit and can't create another project.
 * (At 3, a free user is blocked from the 4th.)
 */
export function isAtProjectLimit(
  plan: Plan,
  activeProjectCount: number,
  limit: number = FREE_PROJECT_LIMIT,
): boolean {
  return plan === "free" && activeProjectCount >= limit;
}
