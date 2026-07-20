/**
 * Model tier for a generation (pure, framework-free):
 * - "economy" — cheap/fast default (Gemini Flash)
 * - "deep"    — higher quality (Claude)
 */
export type ModelTier = "economy" | "deep";

/** Coerce an untrusted value into a valid tier, defaulting to economy. */
export function parseModelTier(value: unknown): ModelTier {
  return value === "deep" ? "deep" : "economy";
}
