"use client";

import { useState } from "react";

const STAGES = [
  { key: "validation", label: "Validation", hint: "The honest verdict on your idea." },
  { key: "structure", label: "Structure", hint: "An editable feature tree." },
  { key: "prd", label: "PRD", hint: "A ready-to-use product spec." },
  { key: "tasks", label: "Tasks", hint: "A checkbox work order for your agent." },
] as const;

type StageKey = (typeof STAGES)[number]["key"];

/**
 * Stage navigation shell for a project. The panels are placeholders until each
 * phase fills them in (validation → structure → prd → tasks).
 */
export function ProjectStages() {
  const [active, setActive] = useState<StageKey>("validation");
  const current = STAGES.find((stage) => stage.key === active) ?? STAGES[0];

  return (
    <div>
      <nav role="tablist" aria-label="Project stages" className="flex gap-1 border-b-2 border-border">
        {STAGES.map((stage) => {
          const selected = stage.key === active;
          return (
            <button
              key={stage.key}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(stage.key)}
              className={`-mb-0.5 border-b-2 px-5 py-3 font-mono text-xs uppercase tracking-[0.08em] transition-colors ${
                selected
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {stage.label}
            </button>
          );
        })}
      </nav>
      <div role="tabpanel" className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="font-medium">{current.label}</p>
        <p className="max-w-sm text-sm text-muted">{current.hint}</p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.08em] text-accent">
          Coming soon
        </p>
      </div>
    </div>
  );
}
