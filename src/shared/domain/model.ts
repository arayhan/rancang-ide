/**
 * Model selection for a generation (pure, framework-free):
 * - "economy"              — cheap/fast default (Gemini Flash)
 * - "deep"                 — higher quality (Claude)
 * - "openrouter:<modelId>" — any model routed via OpenRouter (free ones preferred)
 */
export type ModelTier = "economy" | "deep" | `openrouter:${string}`;

/** OpenRouter model ids look like "vendor/name" with optional ":free" suffix. */
const OPENROUTER_ID = /^[\w.-]+\/[\w.:-]{1,100}$/;

/** Coerce an untrusted value into a valid selection, defaulting to economy. */
export function parseModelTier(value: unknown): ModelTier {
  if (typeof value !== "string") return "economy";
  if (value === "deep") return "deep";
  if (value.startsWith("openrouter:")) {
    const id = value.slice("openrouter:".length);
    if (OPENROUTER_ID.test(id)) return `openrouter:${id}`;
  }
  return "economy";
}
