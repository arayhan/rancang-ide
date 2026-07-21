# Cost notes — AI generation & free quota

_Measured 2026-07-21 from live smoke runs against Gemini (`gemini-flash-latest`)._

## Measured token usage

One full pipeline for a single idea, economy tier (Gemini Flash):

| Stage      | Input tokens | Output tokens | Notes                    |
| ---------- | -----------: | ------------: | ------------------------ |
| Validation |          424 |         2,288 | verdict + flaws + scores |
| Structure  |            ~ |             ~ | feature tree             |
| PRD        |            ~ |             ~ | markdown spec            |
| Tasks      |            ~ |             ~ | 20-item checklist        |
| **Total**  |              |               | **≈ 10,861 tokens**      |

(The 4 generations for one project summed to **10,861 tokens** end-to-end;
validation alone was 2,712.)

## Cost estimate

At Gemini Flash pricing (order of magnitude — **verify current rates** at
<https://ai.google.dev/pricing>), input is roughly $0.15–0.30 / 1M tokens and
output roughly $0.60–2.50 / 1M tokens. With ~11k tokens (mostly output) per
pipeline:

- **≈ $0.01–0.03 per full pipeline** (validation → tree → PRD → tasks).
- The "deep" tier (Claude) would be materially higher — reserve for validation.

## Free-quota calibration

The free tier allows **3 active projects**. Even if every project runs the full
pipeline several times (regenerations included), the cost per free user stays in
the **low single-digit cents** — comfortably subsidizable.

**Conclusion:** keep the free quota at **3 projects**. It is set by product
friction (encouraging upgrade), not by cost pressure. Revisit only if the "deep"
tier becomes the default or output sizes grow substantially. This closes the
free-quota open question in `docs/prd.md` §14.

## Guardrails in place

- Economy (Gemini Flash) is the default tier.
- Quota checked before every AI call; free users blocked past 3 projects.
- Per-user rate limiting on the generation endpoints (abuse / runaway cost).
- Every generation logs `input_tokens` / `output_tokens` to `generations`, so
  real cost can be monitored and this table refreshed from production data.
