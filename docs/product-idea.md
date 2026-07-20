# Product Idea — Rancang Ide

## One-liner
A web app that turns raw ideas into complete product blueprints — validated first (fatal flaws, verdict), then generated into a PRD, BRD, and task breakdown ready for an AI coding agent — for solo developers and indie builders.

## Background
The founder (Ahmed Rayhan Primadedas) is a Frontend Engineer with 7+ years (React/Next.js) at Badr Interactive, Depok — with experience leading frontend at a US edtech startup, building national-scale systems (Ministry of Health / UNDP), applying feature-driven + DDD, and AI-augmented development (Claude Code, Codex). The pain is felt firsthand: side-project ideas get executed without product thinking, scope drifts, AI credits get burned, and projects die halfway. This product is built first and foremost to be used by the founder himself (dogfooding), with a freemium path to side income. The founder is also a GDG Depok organizer (1,800+ members) — a distribution asset for early users.

## The problem
Solo developers & indie builders who use AI coding agents (Claude Code, Cursor, etc.) routinely skip the ideation–validation–spec stage. What they do today: jump straight into coding ("build now, think later") or chat ad-hoc with ChatGPT/Claude — the output is scattered, unstructured, non-persistent, and never questions whether the idea is even worth building. The result: scope creep, features nobody needs, and wasted time/money.

## Target user
Early adopter: the founder himself + solo developers / indie hackers in Indonesia who (a) already use an AI coding agent, (b) have a backlog of side-project ideas, (c) have felt a project die from lack of direction. Not "all developers" — specifically those already vibe-coding and burned by it.

## Proposed solution
A structured pipeline in a single web app: **Idea → Validation → Structure (feature tree) → PRD/BRD → Task breakdown → Export markdown for the AI coding agent.**

**Magic moment:** the user types a 2–3 sentence idea → within ±2 minutes receives (1) a validation report: core assumption, fatal flaws, competition map, verdict strong/weak/pivot, and (2) an editable draft feature tree, which is then generated into a ready-to-use PRD. The key differentiator vs. other PRD generators: **validation-first, not generation-first** — this app is willing to say "the idea is weak" before writing a single line of PRD.

Multi-provider AI (Gemini API / Claude API via the Vercel AI SDK) — cheap model for drafts, smart model for validation.

## Why you
The founder is his own target user (zero guessing about the pain), his React/Next.js + DDD/feature-driven expertise is exactly the stack & architecture used, and he has a real distribution channel via GDG Depok (1,800+ members) + a speaking platform — iteration speed & community access are his unfair advantage; if this fails as a business, he still wins because it becomes a personal tool + portfolio.

## Candidates considered
| Candidate | Unfair advantage | Pain level | Reachability | MVP feasibility | Differentiation |
|---|---|---|---|---|---|
| **A. Validation-first product planner (chosen)** | 🟢 own user + stack match | 🟢 felt firsthand | 🟡 no audience yet | 🟢 4–8 weeks solo | 🟡 crowded, but validation-first angle is rare |
| B. Pure ngodingpakeai clone (PRD generator) | 🟢 stack match | 🟡 already served by competitors | 🔴 head-to-head vs audience-rich incumbent | 🟢 feasible | 🔴 me-too product |
| C. Mobile-first idea capture → spec | 🟡 must learn RN/mobile | 🟡 nice-to-have | 🟡 | 🟡 slower | 🟢 unique |
| D. Full PM toolkit (roadmap, OKR, analytics) | 🔴 gigantic scope | 🟡 | 🔴 | 🔴 unrealistic solo | 🟡 |

Candidate A chosen: wins on feasibility + founder fit, with the caveat that differentiation must stay sharp (the validation layer) and distribution is the main risk. Candidate C is kept as a future phase (companion app), not discarded.

## Risky assumptions
1. **Retention vs. raw chat** — the founder (and other users) will keep returning to this app instead of chatting directly with Claude/ChatGPT, because the structure + persistence + validation feels more valuable than the freedom of open chat.
2. **Willingness to pay** — enough Indonesian solo devs will pay a subscription (in a price-sensitive market with free alternatives) once the free quota runs out.
3. **Distribution without an audience** — the product can find its first 100 users via build-in-public and community, without a ready-made YouTube/media audience (unlike the local competitor).

## Next step
Pressure-test with the **Idea Validator** (done — see `docs/validation-report.md`), then proceed to the **Product Planner** with `docs/planning-brief.md` as pre-fill.
