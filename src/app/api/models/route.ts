import { NextResponse } from "next/server";

/**
 * Model catalog for the picker. Merges the two built-in tiers with
 * OpenRouter's public catalog (no API key needed to list), free models first.
 * Cached for an hour.
 */

type OpenRouterModel = {
  id: string;
  name?: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string };
};

export type CatalogModel = {
  /** Value sent as `model` on generation requests. */
  value: string;
  label: string;
  group: "builtin" | "openrouter-free" | "openrouter-paid";
  context?: number;
};

export async function GET() {
  const builtin: CatalogModel[] = [
    { value: "economy", label: "Economy — Gemini Flash (default)", group: "builtin" },
    { value: "deep", label: "Deep — Claude Sonnet", group: "builtin" },
  ];

  let openrouter: CatalogModel[] = [];
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      // Revalidate hourly — the catalog is large and changes slowly.
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const body = (await res.json()) as { data?: OpenRouterModel[] };
      openrouter = (body.data ?? [])
        .filter((m) => m.id && !m.id.includes("embed"))
        .map((m): CatalogModel => {
          const free = m.pricing?.prompt === "0" && m.pricing?.completion === "0";
          return {
            value: `openrouter:${m.id}`,
            label: m.name ?? m.id,
            group: free ? "openrouter-free" : "openrouter-paid",
            context: m.context_length,
          };
        })
        // Free first, then alphabetical within each group.
        .sort((a, b) =>
          a.group === b.group
            ? a.label.localeCompare(b.label)
            : a.group === "openrouter-free"
              ? -1
              : 1,
        );
    }
  } catch {
    // OpenRouter unreachable — the built-in tiers still work.
  }

  return NextResponse.json(
    { models: [...builtin, ...openrouter] },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } },
  );
}
