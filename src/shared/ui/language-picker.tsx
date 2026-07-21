"use client";

import { useSyncExternalStore } from "react";

import type { Language } from "@/shared/domain/language";

const STORAGE_KEY = "rancang.output_language";
const listeners = new Set<() => void>();

function readLanguage(): Language {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(STORAGE_KEY) === "id" ? "id" : "en";
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/** Read/persist the preferred output language for AI content (per browser). */
export function useLanguage(): [Language, (language: Language) => void] {
  const language = useSyncExternalStore(subscribe, readLanguage, (): Language => "en");
  const update = (next: Language) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    listeners.forEach((listener) => listener());
  };
  return [language, update];
}

const OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "id", label: "ID" },
];

export function LanguagePicker({
  language,
  onChange,
  disabled,
}: {
  language: Language;
  onChange: (language: Language) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="Output language"
      className="inline-flex rounded-sm border-2 border-border p-0.5"
    >
      {OPTIONS.map((option) => {
        const active = option.value === language;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            title={option.value === "id" ? "Bahasa Indonesia" : "English"}
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
