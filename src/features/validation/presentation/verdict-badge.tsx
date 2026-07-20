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
      className={`inline-block rounded-sm px-3 py-1 font-mono text-xs font-medium uppercase tracking-[0.08em] ${className}`}
    >
      {label}
    </span>
  );
}
