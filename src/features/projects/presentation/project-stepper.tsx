"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

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

type StageStatus = "done" | "available" | "locked";

type StepperShellProps = {
  brandHref: string;
  brand: string;
  projectTitle: string;
  completed: Partial<Record<StageKey, boolean>>;
  slots: Partial<Record<StageKey, ReactNode>>;
  /** Extra actions on the right side of the top bar (e.g. Download all). */
  actions?: ReactNode;
};

/**
 * The project detail shell: a sticky navbar (brand + title left, actions +
 * Continue right) over a dedicated full-width stepper shelf, then a full-width
 * panel with the active step's content. Panels stay mounted so streamed content
 * survives step changes.
 */
export function StepperShell({
  brandHref,
  brand,
  projectTitle,
  completed,
  slots,
  actions,
}: StepperShellProps) {
  const t = useTranslations("stages");
  const [active, setActive] = useState<StageKey>("validation");
  const activeIndex = STEPS.findIndex((s) => s.key === active);
  const panelRef = useRef<HTMLDivElement>(null);

  const statusFor = (key: StageKey, requires: StageKey | null): StageStatus => {
    if (completed[key]) return "done";
    if (requires && !completed[requires]) return "locked";
    return "available";
  };

  const goTo = (key: StageKey, status: StageStatus) => {
    if (status !== "locked") setActive(key);
  };

  const nextStep = STEPS[activeIndex + 1];
  const nextStatus = nextStep ? statusFor(nextStep.key, nextStep.requires) : null;
  const canContinue = nextStep !== undefined && nextStatus !== "locked";
  const goNext = () => {
    if (canContinue && nextStep) setActive(nextStep.key);
  };

  // Smooth-scroll panel to top when stepping (keeps the sticky pill legible).
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [active]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar: brand + title (left), actions + Continue (right) */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 md:px-6">
          {/* Left: brand + title */}
          <Link
            href={brandHref}
            className="flex items-center gap-3 whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
          >
            <span>
              {brand.split(" ")[0]}
              <span className="text-accent"> {brand.split(" ").slice(1).join(" ")}</span>
            </span>
            <span className="hidden text-border md:inline">·</span>
            <span
              className="hidden max-w-[20rem] truncate normal-case tracking-normal text-muted md:inline"
              title={projectTitle}
            >
              {projectTitle}
            </span>
          </Link>

          {/* Right: actions + primary CTA */}
          <div className="ml-auto flex items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue}
              className="glow-ring lift inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("next")}
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stepper shelf — its own full-width row directly under the navbar.
          The pill centers on wide screens; on narrow ones it fills the row and
          scrolls horizontally instead (overflow-x on the list zeroes its
          min-width, so centering never clips the first stage). */}
      <div className="sticky top-16 z-20 border-b border-border bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-center px-4 py-2.5 md:px-6">
          <FloatingStepper
            active={active}
            statusFor={statusFor}
            onGo={goTo}
            t={(key: StageKey) => t(key)}
          />
        </div>
      </div>

      {/* Panel — full width, individual slots can constrain their own reading width */}
      <div ref={panelRef} className="flex-1 overflow-y-auto">
        {STEPS.map((step) => {
          const slot = slots[step.key];
          if (!slot) return null;
          const isActive = step.key === active;
          return (
            <div key={step.key} hidden={!isActive} className="min-h-full">
              {slot}
            </div>
          );
        })}
        {!slots[STEPS[activeIndex].key] ? (
          <div className="flex flex-col items-center gap-2 py-24 text-center">
            <p className="font-medium">{t(STEPS[activeIndex].key)}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
              Coming soon
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FloatingStepper({
  active,
  statusFor,
  onGo,
  t,
}: {
  active: StageKey;
  statusFor: (key: StageKey, requires: StageKey | null) => StageStatus;
  onGo: (key: StageKey, status: StageStatus) => void;
  t: (key: StageKey) => string;
}) {
  return (
    <ol
      role="tablist"
      aria-label="Project stages"
      className="hide-scrollbar flex snap-x snap-mandatory items-center gap-1 overflow-x-auto rounded-full border border-border bg-surface/70 p-1 shadow-[0_1px_3px_0_rgba(10,14,26,0.06)]"
    >
      {STEPS.map((step, i) => {
        const status = statusFor(step.key, step.requires);
        const isActive = step.key === active;
        return (
          <li key={step.key} className="flex snap-start items-center">
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? "step" : undefined}
              disabled={status === "locked"}
              onClick={() => onGo(step.key, status)}
              className={`glow-ring inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
                isActive
                  ? "bg-primary text-white shadow-[0_1px_2px_0_rgba(27,68,240,0.35)]"
                  : status === "done"
                    ? "text-success hover:bg-background-2"
                    : "text-muted hover:text-foreground hover:bg-background-2"
              }`}
            >
              <StatusDot status={status} isActive={isActive} />
              <span className="hidden sm:inline">{t(step.key)}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
            {i < STEPS.length - 1 ? (
              <span
                className={`h-px w-3 shrink-0 ${
                  statusFor(STEPS[i + 1].key, STEPS[i + 1].requires) === "locked"
                    ? "bg-border/60"
                    : "bg-border-strong/40"
                }`}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function StatusDot({ status, isActive }: { status: StageStatus; isActive: boolean }) {
  if (status === "done" && !isActive) {
    return (
      <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden>
        <path
          d="M2 6.5 L5 9 L10 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === "locked") {
    return (
      <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden>
        <rect
          x="3"
          y="5.5"
          width="6"
          height="4.5"
          rx="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M4.5 5.5 V4 a1.5 1.5 0 0 1 3 0 V5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden />;
}
