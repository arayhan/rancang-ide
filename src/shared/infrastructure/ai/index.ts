import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";

import type { ModelTier } from "@/shared/domain/model";

/**
 * Resolves a language model per selection. Providers read their API keys from
 * the environment (GOOGLE_GENERATIVE_AI_API_KEY / ANTHROPIC_API_KEY /
 * OPENROUTER_API_KEY) — server-only.
 */

// "-latest" alias: tracks the current flash generation, avoiding pinned-id rot
// (gemini-2.5-flash 404s for new API keys).
const ECONOMY_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
const DEEP_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";

/** OpenRouter is OpenAI-compatible; one gateway, many models. */
function openrouterModel(modelId: string): LanguageModel {
  const provider = createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    headers: {
      // OpenRouter attribution headers (optional but recommended).
      "HTTP-Referer": "https://rancang-ide.vercel.app",
      "X-Title": "Rancang Ide",
    },
  });
  return provider.chatModel(modelId);
}

/** Resolve a language model for the given selection. */
export function getModel(tier: ModelTier = "economy"): LanguageModel {
  if (tier === "deep") return anthropic(DEEP_MODEL);
  if (tier.startsWith("openrouter:")) {
    return openrouterModel(tier.slice("openrouter:".length));
  }
  return google(ECONOMY_MODEL);
}

/** The concrete model id string for a selection (persisted as `model_used`). */
export function modelIdFor(tier: ModelTier = "economy"): string {
  if (tier === "deep") return DEEP_MODEL;
  if (tier.startsWith("openrouter:")) return tier.slice("openrouter:".length);
  return ECONOMY_MODEL;
}
