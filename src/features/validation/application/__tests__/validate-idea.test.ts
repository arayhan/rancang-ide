import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import type { ValidationResult } from "../../domain/schema";
import { parseValidationResult } from "../validate-idea";

const validReport: ValidationResult = {
  core_assumption: "Users will return here instead of chatting directly with an LLM.",
  fatal_flaws: [
    {
      title: "Wrapper problem",
      severity: "high",
      why_it_matters: "Free chat produces a similar PRD.",
      fast_test: "Dogfood for two weeks and log defections.",
    },
  ],
  competition: {
    current_behavior: "Coding straight, or ad-hoc chat.",
    competitors: [{ name: "ChatPRD", note: "Generation-first, no validation gate." }],
    real_enemy: "The just-build habit.",
    differentiation: "A validation gate that says 'don't build this'.",
  },
  scorecard: {
    pain_intensity: { score: 4, note: "Felt firsthand." },
    buyer_clarity: { score: 3, note: "Payer unproven." },
    urgency: { score: 2, note: "No deadline." },
    differentiation: { score: 3, note: "Copyable angle." },
    speed_to_validate: { score: 5, note: "Founder is user zero." },
    founder_advantage: { score: 4, note: "Stack + distribution fit." },
  },
  verdict: "strong",
  verdict_summary: "Strong as a personal tool because the founder is the first user.",
};

describe("parseValidationResult", () => {
  it("accepts a well-formed report", () => {
    const parsed = parseValidationResult(validReport);
    expect(parsed.verdict).toBe("strong");
    expect(parsed.fatal_flaws).toHaveLength(1);
  });

  it("rejects an unknown verdict", () => {
    expect(() =>
      parseValidationResult({ ...validReport, verdict: "amazing" }),
    ).toThrow(ZodError);
  });

  it("rejects a score outside 1–5", () => {
    const bad = {
      ...validReport,
      scorecard: {
        ...validReport.scorecard,
        urgency: { score: 7, note: "too high" },
      },
    };
    expect(() => parseValidationResult(bad)).toThrow(ZodError);
  });

  it("rejects an empty fatal_flaws list", () => {
    expect(() =>
      parseValidationResult({ ...validReport, fatal_flaws: [] }),
    ).toThrow(ZodError);
  });

  it("rejects a missing section", () => {
    const withoutCompetition: Record<string, unknown> = { ...validReport };
    delete withoutCompetition.competition;
    expect(() => parseValidationResult(withoutCompetition)).toThrow(ZodError);
  });
});
