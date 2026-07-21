"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setLocale } from "@/shared/lib/locale";

const LOCALES = ["en", "id"] as const;

/** Switch the interface language (server action sets NEXT_LOCALE, then refresh). */
export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const set = (next: (typeof LOCALES)[number]) =>
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });

  return (
    <div
      role="group"
      aria-label="Interface language"
      className="inline-flex rounded-sm border-2 border-border p-0.5"
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => set(l)}
          aria-pressed={locale === l}
          disabled={pending}
          className={`glow-ring rounded-[3px] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors disabled:opacity-50 ${
            locale === l ? "bg-primary text-white" : "text-muted hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
