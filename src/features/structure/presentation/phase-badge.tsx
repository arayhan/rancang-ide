import type { TreePhase } from "@/features/structure/domain/schema";

const PHASES: Record<TreePhase, { label: string; className: string }> = {
  mvp: { label: "MVP", className: "border-primary text-accent" },
  v2: { label: "V2", className: "border-border text-muted" },
  later: { label: "Later", className: "border-border text-muted" },
};

export function PhaseBadge({ phase }: { phase: TreePhase }) {
  const { label, className } = PHASES[phase];
  return (
    <span
      className={`rounded-sm border-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] ${className}`}
    >
      {label}
    </span>
  );
}
