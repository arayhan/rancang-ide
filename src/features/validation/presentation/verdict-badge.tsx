import type { Verdict } from "@/features/validation/domain/schema";

const VERDICTS: Record<Verdict, { label: string; className: string }> = {
  strong: { label: "Strong", className: "bg-success text-background" },
  weak: { label: "Weak", className: "bg-error text-white" },
  pivot: { label: "Pivot", className: "bg-warning text-background" },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const { label, className } = VERDICTS[verdict];
  return (
    <span
      key={verdict}
      className={`stamp inline-block rounded-sm px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.1em] shadow-[3px_3px_0_0_var(--shadow)] ${className}`}
    >
      {label}
    </span>
  );
}
