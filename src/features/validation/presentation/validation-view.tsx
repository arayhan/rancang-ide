"use client";

import { useObject } from "@ai-sdk/react";
import type { DeepPartial } from "ai";

import {
  validationResultSchema,
  type Scorecard,
  type ValidationResult,
} from "@/features/validation/domain/schema";
import type { ModelTier } from "@/shared/domain/model";
import { Button } from "@/shared/ui/button";

import { VerdictBadge } from "./verdict-badge";

type PartialReport = DeepPartial<ValidationResult>;

type ValidationViewProps = {
  projectId: string;
  initialResult: ValidationResult | null;
  tier?: ModelTier;
};

const SCORE_AREAS: { key: keyof Scorecard; label: string }[] = [
  { key: "pain_intensity", label: "Pain intensity" },
  { key: "buyer_clarity", label: "Buyer clarity" },
  { key: "urgency", label: "Urgency" },
  { key: "differentiation", label: "Differentiation" },
  { key: "speed_to_validate", label: "Speed to validate" },
  { key: "founder_advantage", label: "Founder advantage" },
];

const SEVERITY_CLASS: Record<string, string> = {
  high: "text-error",
  medium: "text-warning",
  low: "text-muted",
};

export function ValidationView({
  projectId,
  initialResult,
  tier = "economy",
}: ValidationViewProps) {
  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/validate",
    schema: validationResultSchema,
  });

  const report: PartialReport | undefined = object ?? initialResult ?? undefined;
  const started = isLoading || object !== undefined || initialResult !== null;

  const run = () => submit({ project_id: projectId, model: tier });

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="max-w-md text-muted">
          Get an honest verdict on this idea — core assumption, fatal flaws,
          competition, and a scorecard. Takes about a minute.
        </p>
        <Button onClick={run}>Run validation</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {report?.verdict ? <VerdictBadge verdict={report.verdict} /> : null}
          {isLoading ? (
            <span className="caret font-mono text-xs uppercase tracking-[0.08em] text-accent">
              Generating
            </span>
          ) : null}
        </div>
        {isLoading ? (
          <button
            onClick={stop}
            className="rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:border-primary"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={run}
            className="rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:border-primary"
          >
            Regenerate
          </button>
        )}
      </div>

      {error ? (
        <div className="rounded-md border-2 border-error p-4">
          <p className="text-sm text-error">
            Something went wrong generating the report. Your quota or connection
            may be the cause.
          </p>
          <button
            onClick={run}
            className="mt-3 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className={isLoading ? "scanning rounded-md" : ""}>
        {report ? <Report report={report} /> : <Skeleton />}
      </div>
    </div>
  );
}

function Report({ report }: { report: PartialReport }) {
  const flaws = report.fatal_flaws ?? [];
  const competitors = report.competition?.competitors ?? [];

  return (
    <div className="flex flex-col gap-8">
      {report.verdict_summary ? (
        <p className="text-lg leading-relaxed">{report.verdict_summary}</p>
      ) : null}

      {report.core_assumption ? (
        <Section title="Core assumption">
          <p className="text-muted">{report.core_assumption}</p>
        </Section>
      ) : null}

      {flaws.length > 0 ? (
        <Section title="Fatal flaws">
          <ul className="flex flex-col gap-4">
            {flaws.map((flaw, i) => (
              <li key={i} className="rounded-md border-2 border-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{flaw?.title}</span>
                  {flaw?.severity ? (
                    <span
                      className={`font-mono text-xs uppercase tracking-[0.08em] ${
                        SEVERITY_CLASS[flaw.severity] ?? "text-muted"
                      }`}
                    >
                      {flaw.severity}
                    </span>
                  ) : null}
                </div>
                {flaw?.why_it_matters ? (
                  <p className="mt-2 text-sm text-muted">{flaw.why_it_matters}</p>
                ) : null}
                {flaw?.fast_test ? (
                  <p className="mt-2 text-sm">
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                      Fast test:{" "}
                    </span>
                    {flaw.fast_test}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {report.competition ? (
        <Section title="Competition">
          <div className="flex flex-col gap-3 text-sm">
            {report.competition.current_behavior ? (
              <p>
                <Label>Current behavior</Label> {report.competition.current_behavior}
              </p>
            ) : null}
            {report.competition.real_enemy ? (
              <p>
                <Label>Real enemy</Label> {report.competition.real_enemy}
              </p>
            ) : null}
            {report.competition.differentiation ? (
              <p>
                <Label>Differentiation</Label> {report.competition.differentiation}
              </p>
            ) : null}
            {competitors.length > 0 ? (
              <ul className="mt-1 flex flex-col gap-1 text-muted">
                {competitors.map((c, i) => (
                  <li key={i}>
                    <span className="text-foreground">{c?.name}</span>
                    {c?.note ? ` — ${c.note}` : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Section>
      ) : null}

      {report.scorecard ? (
        <Section title="Scorecard">
          <ul className="flex flex-col gap-2">
            {SCORE_AREAS.map(({ key, label }) => {
              const area = report.scorecard?.[key];
              return (
                <li key={key} className="flex items-baseline justify-between gap-4">
                  <span className="text-sm">{label}</span>
                  <span className="flex items-baseline gap-3">
                    {area?.note ? (
                      <span className="text-right text-xs text-muted">{area.note}</span>
                    ) : null}
                    <span className="font-mono text-sm">
                      {typeof area?.score === "number" ? `${area.score}/5` : "—"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-foreground">{children}:</span>;
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-4 animate-pulse rounded-sm bg-border" />
      ))}
    </div>
  );
}
