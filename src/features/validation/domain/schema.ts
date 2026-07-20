import { z } from "zod";

/** The bottom-line call on an idea. */
export const verdictSchema = z.enum(["strong", "weak", "pivot"]);

export const severitySchema = z.enum(["low", "medium", "high"]);

/** A single make-or-break weakness, with a cheap way to test it. */
export const fatalFlawSchema = z.object({
  title: z.string().describe("Short name of the risk."),
  severity: severitySchema,
  why_it_matters: z.string().describe("What breaks if this is true."),
  fast_test: z.string().describe("A cheap, fast way to test this risk."),
});

const scoredAreaSchema = z.object({
  score: z.number().int().min(1).max(5),
  note: z.string().describe("One-line justification for the score."),
});

/**
 * Six-dimension scorecard (each 1–5) from the idea-validator methodology.
 * General enough for any product idea.
 */
export const scorecardSchema = z.object({
  pain_intensity: scoredAreaSchema,
  buyer_clarity: scoredAreaSchema,
  urgency: scoredAreaSchema,
  differentiation: scoredAreaSchema,
  speed_to_validate: scoredAreaSchema,
  founder_advantage: scoredAreaSchema,
});

export const competitorSchema = z.object({
  name: z.string(),
  note: z.string().describe("Their angle and where they fall short."),
});

/** The competitive picture, including the status quo (doing nothing). */
export const competitionSchema = z.object({
  current_behavior: z
    .string()
    .describe("How people solve this today, including doing nothing."),
  competitors: z.array(competitorSchema),
  real_enemy: z.string().describe("The true competitor — often a habit."),
  differentiation: z
    .string()
    .describe("The one thing this idea does that alternatives don't."),
});

/** The full validation report — the AI output contract for /api/validate. */
export const validationResultSchema = z.object({
  core_assumption: z
    .string()
    .describe("The single assumption that, if false, kills the idea."),
  fatal_flaws: z.array(fatalFlawSchema).min(1),
  competition: competitionSchema,
  scorecard: scorecardSchema,
  verdict: verdictSchema,
  verdict_summary: z
    .string()
    .describe("The verdict in 1–2 sentences, always giving the reason."),
});

export type Verdict = z.infer<typeof verdictSchema>;
export type Severity = z.infer<typeof severitySchema>;
export type FatalFlaw = z.infer<typeof fatalFlawSchema>;
export type Scorecard = z.infer<typeof scorecardSchema>;
export type Competition = z.infer<typeof competitionSchema>;
export type ValidationResult = z.infer<typeof validationResultSchema>;
