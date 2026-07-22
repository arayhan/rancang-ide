"use client";

import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

export type StageKey =
  | "validation"
  | "structure"
  | "prd"
  | "brd"
  | "database_design"
  | "system_design"
  | "tasks";

type Step = { key: StageKey; requires: StageKey | null };

/** Ordered pipeline: Validation → Structure → PRD → BRD → Database → System → Tasks. */
const STEPS: readonly Step[] = [
  { key: "validation", requires: null },
  { key: "structure", requires: null },
  { key: "prd", requires: null },
  { key: "brd", requires: null },
  { key: "database_design", requires: "prd" },
  { key: "system_design", requires: "prd" },
  { key: "tasks", requires: "prd" },
];

export type StageStatus = "done" | "available" | "locked";

type ProjectStepperProps = {
  /** Which stages currently have persisted content (marks them "done"). */
  completed: Partial<Record<StageKey, boolean>>;
  slots: Partial<Record<StageKey, ReactNode>>;
};

/**
 * Numbered stepper: click to jump between stages, respects prerequisites,
 * keeps every stage mounted so streamed/edited content survives navigation.
 */
export function ProjectStepper({ completed, slots }: ProjectStepperProps) {
  const t = useTranslations("stages");
  const [active, setActive] = useState<StageKey>("validation");
  const activeIndex = STEPS.findIndex((s) => s.key === active);

  const statusFor = (key: StageKey, requires: StageKey | null): StageStatus => {
    if (completed[key]) return "done";
    if (requires && !completed[requires]) return "locked";
    return "available";
  };

  const goTo = (key: StageKey, status: StageStatus) => {
    if (status !== "locked") setActive(key);
  };

  const next = () => {
    const nextStep = STEPS[activeIndex + 1];
    if (!nextStep) return;
    const status = statusFor(nextStep.key, nextStep.requires);
    if (status !== "locked") setActive(nextStep.key);
  };
  const back = () => {
    const prev = STEPS[activeIndex - 1];
    if (prev) setActive(prev.key);
  };

  const activeStep = STEPS[activeIndex];
  const activeStatus = statusFor(activeStep.key, activeStep.requires);

  return (
    <div className="flex flex-col gap-6">
      {/* Step rail */}
      <ol className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
        {STEPS.map((step, i) => {
          const status = statusFor(step.key, step.requires);
          const isActive = step.key === active;
          const isPast = i < activeIndex;
          return (
            <li key={step.key} className="flex-1 snap-start">
              <button
                type="button"
                onClick={() => goTo(step.key, status)}
                disabled={status === "locked"}
                aria-current={isActive ? "step" : undefined}
                aria-label={t(step.key)}
                className={`glow-ring group flex w-full min-w-[9rem] flex-col items-start gap-1 rounded-md border-2 px-3 py-2 text-left transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-[0_10px_28px_-14px_rgba(27,68,240,0.45)]"
                    : status === "done"
                      ? "border-success/60 bg-success/5 hover:border-success"
                      : "border-border bg-surface hover:border-border-strong"
                }`}
              >
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  <StepGlyph index={i} status={status} isActive={isActive} isPast={isPast} />
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-display text-sm font-semibold ${
                    isActive ? "text-foreground" : "text-foreground/90"
                  }`}
                >
                  {t(step.key)}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em]">
                  {status === "done" ? (
                    <span className="text-success">✓ {t("done")}</span>
                  ) : status === "locked" && step.requires ? (
                    <span className="text-muted">
                      {t("locked", { requires: t(step.requires) })}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Panel — every filled slot stays mounted so streaming content survives step changes */}
      <div className="rounded-md border-2 border-border bg-surface/40 p-5 md:p-6">
        {STEPS.map((step) => {
          const slot = slots[step.key];
          if (!slot) return null;
          return (
            <div key={step.key} hidden={step.key !== active}>
              {slot}
            </div>
          );
        })}
        {!slots[activeStep.key] ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="font-medium">{t(activeStep.key)}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
              {activeStatus === "locked" && activeStep.requires
                ? t("locked", { requires: t(activeStep.requires) })
                : "Coming soon"}
            </p>
          </div>
        ) : null}
      </div>

      {/* Prev / Next controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={activeIndex === 0}
          className="glow-ring rounded-sm border-2 border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-primary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← {t("back")}
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {t("stepOf", { current: activeIndex + 1, total: STEPS.length })}
        </span>
        <button
          type="button"
          onClick={next}
          disabled={activeIndex === STEPS.length - 1}
          className="glow-ring rounded-sm border-2 border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-primary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("next")} →
        </button>
      </div>
    </div>
  );
}

function StepGlyph({
  status,
  isActive,
  isPast,
}: {
  index: number;
  status: StageStatus;
  isActive: boolean;
  isPast: boolean;
}) {
  if (status === "done") return <span className="text-success">●</span>;
  if (isActive) return <span className="text-primary">◆</span>;
  if (status === "locked") return <span>◌</span>;
  return <span className={isPast ? "text-muted" : "text-accent"}>◇</span>;
}
