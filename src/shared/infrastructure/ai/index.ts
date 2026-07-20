import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

import type { ModelTier } from "@/shared/domain/model";

/**
 * Resolves a language model per tier. Providers read their API keys from the
 * environment (GOOGLE_GENERATIVE_AI_API_KEY / ANTHROPIC_API_KEY) — server-only.
 */

const ECONOMY_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const DEEP_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";

/** Resolve a language model for the given tier. */
export function getModel(tier: ModelTier = "economy"): LanguageModel {
  return tier === "deep" ? anthropic(DEEP_MODEL) : google(ECONOMY_MODEL);
}

/** The concrete model id string for a tier (persisted as `model_used`). */
export function modelIdFor(tier: ModelTier = "economy"): string {
  return tier === "deep" ? DEEP_MODEL : ECONOMY_MODEL;
}
