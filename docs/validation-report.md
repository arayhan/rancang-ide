# Validation Report — Rancang Ide (validation-first product planner)

_Generated: 2026-07-19_

## Verdict

**Strong — with framing conditions.**

As a _personal tool built in-public with a monetization path_, the idea is strong: low risk (worst case = you get a personal tool + portfolio), high founder fit, and an MVP feasible in 4–8 weeks solo. As a _standalone business that must earn from day one_, the idea is weak — the market is crowded and the founder hasn't proven distribution yet. The #1 risk to keep monitoring: **retention vs. chatting directly with Claude/ChatGPT**.

## Scorecard

| Area              | Score | Read                                                                                                                                                                                                                                                                                    |
| ----------------- | ----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pain intensity    |   4/5 | Founder feels it firsthand: projects die from lack of spec, AI credits wasted — real pain, but many devs aren't aware this is a problem                                                                                                                                                 |
| Buyer clarity     |   3/5 | Early adopter is clear (founder + similar devs), but the _payer_ isn't proven — those who feel the pain won't necessarily pay                                                                                                                                                           |
| Urgency           |   2/5 | No external deadline; a free alternative (direct chat) is always available — this is a vitamin for most, a painkiller for the already-burned                                                                                                                                            |
| Differentiation   |   3/5 | Validation-first + persistence + AI-ready export = a real angle; but easy to copy and the market is already crowded (ngodingpakeai, ChatPRD, Keeborg, etc.)                                                                                                                             |
| Speed to validate |   5/5 | Founder = first user; the core assumption can be tested within 2 weeks of personal use without any external users                                                                                                                                                                       |
| Founder advantage |   4/5 | Perfect stack match (React/Next.js + DDD/feature-driven) + own user + capacity to build it himself (🟢). Distribution actually EXISTS: GDG Depok organizer 1,800+ members + regular speaker (🟢). Still less reach than the local competitor with 29.5K YouTube subs, but far from zero |

## Core Assumption

**"I myself (then similar solo devs) will consistently return to this app to process ideas — instead of chatting directly with Claude/ChatGPT — because the validation report + structure + persistence feels more valuable than open chat."**

If this is false for the founder himself, the idea dies. No survey of anyone else is needed to test it.

## Fatal Flaws

| Risk                                                                                                                                                                                                                                             | Severity | Why It Matters                                                                                                         | Fast Test                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wrapper problem** — a well-prompted Claude/ChatGPT produces an equivalent PRD for free; if this app is just "good prompt + UI," there's no reason to stay                                                                                      | High     | Value must come from the _workflow_ (validation gate, tree editing, persistence, export), not from the AI text quality | Dogfood 2 weeks: log every time you're tempted to open Claude directly instead of your own app. >50% defection = the workflow isn't valuable enough |
| **Distribution** — side income needs users; the local competitor has a distribution engine (YouTube 29.5K). The CV reveals the founder does NOT start from zero: GDG Depok organizer 1,800+ members + regular speaker → severity drops to Medium | Medium   | Community ≠ automatic conversion; you still need proof people will use & pay                                           | Demo at 1 GDG event/session or post to the group: measure whether ≥50 sign up for the waitlist / ≥10 run the pipeline to completion                 |
| **Freemium unit economics** — each generation consumes tokens; the free tier can become a cost center                                                                                                                                            | Medium   | If the cost per free user > your subsidy capacity, freemium leaks                                                      | Compute the real cost per full pipeline run (Gemini Flash vs. Claude); set the free quota (e.g. 3 projects) based on the number, not a feeling      |

## Problem Reality

- **Pain:** "I start excited, three weeks later the scope is everywhere and I'm bored" — the classic solo-dev + AI-agent pattern. Cost: weeks of work + millions of tokens for a product that never ships. Frequency: every new side project (a few times per year per person).
- **Early adopter:** The founder himself — a frontend engineer with an idea backlog, a Claude Code user, who has felt a project die from lack of direction. Next ring: software-house coworkers & the Indonesian AI-coding community.
- **Vitamin or painkiller:** **A vitamin for most devs, a painkiller for the minority who are already burned.** To become a painkiller more broadly, the positioning must hit the real cost: "stop burning credits & time on products nobody needs" — not "make PRDs faster."

## Competition

- **Current behavior:** Coding straight without a spec; or ad-hoc chatting with ChatGPT/Claude; or (a few) using ngodingpakeai / ChatPRD / Notion templates.
- **Real enemy:** The **"just build" habit** + the comfort of open chat. Not any specific competitor — habit.
- **Differentiation needed:** The one thing open chat & other PRD generators don't do: **a validation gate willing to say "don't build this" before writing the PRD** — plus project persistence and export optimized for AI coding agents. Drop this feature and the product becomes me-too.

## First 10 Customers

1. **Myself + 3–5 coworkers** — use it for a real side project this week; ask coworkers to use it for 1 of their ideas; success = they complete 1 full pipeline unguided.
2. **Build-in-public on X/Threads/LinkedIn** — post progress + your own idea's validation report (a screenshot of a "weak" verdict will be share-friendly because it's honest); success = 50 waitlist signups in 4 weeks.
3. **Indonesian dev communities** (Telegram/Discord dev groups, including the existing AI-coding community + GDG Depok network) — not link spam, but sharing a case study "I validated 3 of my side-project ideas, 2 turned out weak, here's the report"; success = 10 people request access and run the pipeline to completion.

## MVP

- **Build:** Auth (Supabase) → idea input → **validation report** (assumption, flaws, competition, scorecard, verdict) → feature tree (editable, collapsible) → generate PRD markdown → export/copy for Claude Code. Multi-provider via Vercel AI SDK (default Gemini Flash for economy, smart-model option for validation). Project history. Free quota of 3 projects (paywall stub, no payment gateway needed yet).
- **Cut (not needed for v1):** Full BRD, team collaboration, free-form canvas à la react-flow (tree view first), a real payment gateway, template marketplace, multi-language toggle, mobile app, analytics dashboard, Notion/Linear integration.
- **2-week test:** The founder processes **3 of his own ideas** end-to-end + 5 external people process 1 idea each. Pass metric: (a) the founder doesn't defect to direct chat, (b) ≥3 of 5 external people return for a 2nd project unprompted. If it fails: the pivot isn't killing the idea — it's shifting from "web app" to "skill/CLI for Claude Code" (distribution via the existing ecosystem).

## Edits Applied to product-idea.md

- Created `docs/product-idea.md` from this validation run (condensed intake — the founder already provided full context).
- Target user narrowed to "solo devs who **already** use an AI coding agent and have been burned" (Step 3 finding).
- Risky assumptions filled from these validation findings.
- Founder-advantage score & distribution flaw revised after the CV revealed a real distribution asset (GDG Depok).

## Next Step

Proceed to the **Product Planner** with `docs/planning-brief.md` as pre-fill — with the MVP scope locked above.
