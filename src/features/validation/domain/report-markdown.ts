import type { ValidationResult } from "./schema";

const SCORE_LABELS: Record<string, string> = {
  pain_intensity: "Pain intensity",
  buyer_clarity: "Buyer clarity",
  urgency: "Urgency",
  differentiation: "Differentiation",
  speed_to_validate: "Speed to validate",
  founder_advantage: "Founder advantage",
};

/** Serialize a validation report to markdown (for per-stage download). Pure. */
export function validationToMarkdown(report: ValidationResult): string {
  const lines: string[] = [];
  lines.push(`# Validation report`, "");
  lines.push(`**Verdict: ${report.verdict.toUpperCase()}** — ${report.verdict_summary}`, "");
  lines.push(`## Core assumption`, "", report.core_assumption, "");

  lines.push(`## Fatal flaws`, "");
  for (const flaw of report.fatal_flaws) {
    lines.push(`### ${flaw.title} (${flaw.severity})`);
    lines.push(`- Why it matters: ${flaw.why_it_matters}`);
    lines.push(`- Fast test: ${flaw.fast_test}`, "");
  }

  lines.push(`## Competition`, "");
  lines.push(`- Current behavior: ${report.competition.current_behavior}`);
  lines.push(`- Real enemy: ${report.competition.real_enemy}`);
  lines.push(`- Differentiation: ${report.competition.differentiation}`);
  for (const c of report.competition.competitors) {
    lines.push(`- ${c.name} — ${c.note}`);
  }
  lines.push("");

  lines.push(`## Scorecard`, "");
  for (const [key, value] of Object.entries(report.scorecard)) {
    lines.push(`- ${SCORE_LABELS[key] ?? key}: ${value.score}/5 — ${value.note}`);
  }
  lines.push("");

  return lines.join("\n");
}
