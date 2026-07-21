"use client";

import { useSyncExternalStore } from "react";

import type { ModelTier } from "@/shared/domain/model";

const STORAGE_KEY = "rancang.model_tier";
const listeners = new Set<() => void>();

function readTier(): ModelTier {
  if (typeof window === "undefined") return "economy";
  return window.localStorage.getItem(STORAGE_KEY) === "deep" ? "deep" : "economy";
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/** Read/persist the user's preferred model tier (per browser), SSR-safe. */
export function useModelTier(): [ModelTier, (tier: ModelTier) => void] {
  const tier = useSyncExternalStore(
    subscribe,
    readTier,
    (): ModelTier => "economy",
  );

  const update = (next: ModelTier) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    listeners.forEach((listener) => listener());
  };

  return [tier, update];
}

const OPTIONS: { value: ModelTier; label: string; hint: string }[] = [
  { value: "economy", label: "Economy", hint: "Gemini Flash — fast & cheap (default)" },
  { value: "deep", label: "Deep", hint: "Claude — higher quality (needs an Anthropic key)" },
];

export function ModelPicker({
  tier,
  onChange,
  disabled,
}: {
  tier: ModelTier;
  onChange: (tier: ModelTier) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="Model tier"
      className="inline-flex rounded-sm border-2 border-border p-0.5"
    >
      {OPTIONS.map((option) => {
        const active = option.value === tier;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            title={option.hint}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`glow-ring rounded-[3px] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors disabled:opacity-50 ${
              active ? "bg-primary text-white" : "text-muted hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
