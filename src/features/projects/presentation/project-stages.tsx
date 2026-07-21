"use client";

import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

const STAGES = [
  { key: "validation", label: "Validation", hint: "The honest verdict on your idea." },
  { key: "structure", label: "Structure", hint: "An editable feature tree." },
  { key: "prd", label: "PRD", hint: "A ready-to-use product spec." },
  { key: "tasks", label: "Tasks", hint: "A checkbox work order for your agent." },
  { key: "brd", label: "BRD", hint: "Business requirements document." },
  { key: "database_design", label: "Database", hint: "Schema & relationships." },
  { key: "system_design", label: "System", hint: "Architecture & components." },
] as const;

type StageKey = (typeof STAGES)[number]["key"];

type ProjectStagesProps = {
  /** Optional rendered content per stage; stages without a slot show a placeholder. */
  slots?: Partial<Record<StageKey, ReactNode>>;
};

/**
 * Stage navigation shell for a project. Filled stages render their slot; the
 * rest show a placeholder until later phases fill them in.
 */
export function ProjectStages({ slots }: ProjectStagesProps) {
  const t = useTranslations("stages");
  const [active, setActive] = useState<StageKey>("validation");
  const current = STAGES.find((stage) => stage.key === active) ?? STAGES[0];
  const activeSlot = slots?.[active];

  return (
    <div>
      <nav
        role="tablist"
        aria-label="Project stages"
        className="flex flex-wrap gap-1 border-b-2 border-border"
      >
        {STAGES.map((stage) => {
          const selected = stage.key === active;
          return (
            <button
              key={stage.key}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(stage.key)}
              className={`glow-ring -mb-0.5 rounded-t-sm border-b-2 px-5 py-3 font-mono text-xs uppercase tracking-[0.08em] transition-colors ${
                selected
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {t(stage.key)}
            </button>
          );
        })}
      </nav>
      <div role="tabpanel" className="py-8">
        {/* Every filled slot stays mounted (just hidden) so in-progress or
            streamed content survives tab switches. */}
        {STAGES.map((stage) => {
          const slot = slots?.[stage.key];
          if (!slot) return null;
          return (
            <div key={stage.key} hidden={stage.key !== active}>
              {slot}
            </div>
          );
        })}
        {!activeSlot ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="font-medium">{t(current.key)}</p>
            <p className="max-w-sm text-sm text-muted">{current.hint}</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.08em] text-accent">
              Coming soon
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
