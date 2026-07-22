"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { parseModelTier, type ModelTier } from "@/shared/domain/model";

const STORAGE_KEY = "rancang.model_choice";
const listeners = new Set<() => void>();

function readTier(): ModelTier {
  if (typeof window === "undefined") return "economy";
  return parseModelTier(window.localStorage.getItem(STORAGE_KEY));
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/** Read/persist the preferred model selection (per browser), SSR-safe. */
export function useModelTier(): [ModelTier, (tier: ModelTier) => void] {
  const tier = useSyncExternalStore(subscribe, readTier, (): ModelTier => "economy");

  const update = (next: ModelTier) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    listeners.forEach((listener) => listener());
  };

  return [tier, update];
}

// ── Catalog (built-ins + OpenRouter, free first) ─────────────────────────────

type CatalogModel = {
  value: string;
  label: string;
  group: "builtin" | "openrouter-free" | "openrouter-paid";
};

const FALLBACK: CatalogModel[] = [
  { value: "economy", label: "Economy — Gemini Flash (default)", group: "builtin" },
  { value: "deep", label: "Deep — Claude Sonnet", group: "builtin" },
];

// Fetched once per page load, shared by every picker instance.
let catalogPromise: Promise<CatalogModel[]> | null = null;
function loadCatalog(): Promise<CatalogModel[]> {
  catalogPromise ??= fetch("/api/models")
    .then((res) => (res.ok ? res.json() : { models: FALLBACK }))
    .then((body: { models?: CatalogModel[] }) =>
      body.models && body.models.length > 0 ? body.models : FALLBACK,
    )
    .catch(() => FALLBACK);
  return catalogPromise;
}

export function ModelPicker({
  tier,
  onChange,
  disabled,
}: {
  tier: ModelTier;
  onChange: (tier: ModelTier) => void;
  disabled?: boolean;
}) {
  const [models, setModels] = useState<CatalogModel[]>(FALLBACK);

  useEffect(() => {
    let alive = true;
    void loadCatalog().then((catalog) => {
      if (alive) setModels(catalog);
    });
    return () => {
      alive = false;
    };
  }, []);

  const builtin = models.filter((m) => m.group === "builtin");
  const free = models.filter((m) => m.group === "openrouter-free");
  const paid = models.filter((m) => m.group === "openrouter-paid");

  return (
    <select
      value={tier}
      disabled={disabled}
      aria-label="AI model"
      onChange={(e) => onChange(parseModelTier(e.target.value))}
      className="glow-ring max-w-64 rounded-sm border-2 border-border bg-surface px-2 py-1.5 font-mono text-[11px] tracking-[0.02em] outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      <optgroup label="Built-in">
        {builtin.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </optgroup>
      {free.length > 0 ? (
        <optgroup label="OpenRouter · Free">
          {free.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </optgroup>
      ) : null}
      {paid.length > 0 ? (
        <optgroup label="OpenRouter · Paid">
          {paid.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </optgroup>
      ) : null}
    </select>
  );
}
