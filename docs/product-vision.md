# Product Vision — Rancang Ide

_Strategy, brand, audience, and voice. Generated from `docs/VISION.md`. Visual design tokens live in `docs/design.md` (run the Design System skill)._

---

## 1. Vision & Mission

**Vision statement**
Every Indonesian solo builder stops building products nobody needs — because every idea passes through an honest validation gate before it becomes code.

**Mission statement**
Rancang Ide turns raw ideas into product blueprints that are validated first, then generated into a PRD and task breakdown ready for an AI coding agent — in minutes, from one persistent place.

**Founder's why**
The founder (Ahmed Rayhan Primadedas) is a frontend engineer with 7+ years who has repeatedly watched his own side projects die: excited in week one, scope drifting by week three, AI credits gone, the product never shipped. He has already applied feature-driven + DDD on national-scale work and actively uses Claude Code — so he isn't just the target user, he also has the technical capacity to build this quickly himself. Rancang Ide is the tool he wishes already existed — built for himself first, then for builders who hit the same pattern.

**Core values**
- **Honest first, friendly second.** The product dares to say "the idea is weak" with reasons, not a cheerleader that approves anything. A pleasant but wrong validation is more harmful than a bitter but correct verdict.
- **Workflow over text.** Value comes from the flow (validation gate → tree → PRD → tasks → export) and persistence, not just good AI output. If it's only "good prompt + UI," this product doesn't deserve to exist.
- **Small scope, one magic moment.** Every added feature must defend itself against "could this be v2?". The founder has ADHD — complexity is the enemy, not a feature.
- **Local without apology.** Indonesian language, context, pricing, and use-case examples are an advantage, not a translated version of Western tools.

---

## 2. User Research

**Primary persona**
**Rafi, 26, Frontend Engineer in Jakarta/Depok.** Works full-time, codes side projects at night and on weekends using Claude Code. Has 5–6 ideas in Notes he hasn't touched. His last two projects stalled because "when I got into it, I realized the scope was huge / unclear where it was going." Price-sensitive (thinks twice about subscribing to a $10+/month tool), but willing to pay for something that genuinely saves his time. Likes build-in-public, participates in dev communities on Discord/Telegram/X.

**Secondary personas**
- **Pre-product technical founder** — can already code, has a business idea, needs to validate + spec before committing months.
- **Agency/software-house developer** — needs to draft a PRD/BRD quickly for internal or client needs, without a heavy document ritual.

**Jobs to be done**
- When I have a new idea, I want to quickly know if it's worth building, so I don't waste weeks on a product nobody needs.
- When an idea passes validation, I want a structured blueprint (features, PRD, tasks), so my AI coding agent has clear direction and doesn't drift.
- When I return to an old project, I want all the context saved neatly, so I don't have to reconstruct from scratch each time.

**Pain points**
- Ad-hoc chat with ChatGPT/Claude: results scattered across many conversations, non-persistent, unstructured.
- Nothing forces the "is this worth it?" question — you jump straight to the solution.
- Handoff to an AI coding agent is often messy; the agent drifts because the spec isn't clear.
- AI credits and time wasted on features that turn out to be unneeded.

**Current alternatives**
Coding straight without a spec (most common); open chat with ChatGPT/Claude; ngodingpakeai; ChatPRD/Keeborg; Notion PRD templates.

**Key assumptions to validate**
1. **Retention vs. open chat** — the founder (then other users) will consistently return to Rancang Ide instead of chatting directly with Claude/ChatGPT. _(Tested via 2-week dogfooding; if the founder himself defects >50% of the time, the product fails.)_
2. **Willingness to pay** — enough Indonesian solo devs will pay for Pro after the free quota, in a price-sensitive market with free alternatives.
3. **Distribution without an audience** — the first 100 users can be reached via build-in-public + community, without a ready-made media audience.

**Blind spots (realistic, not founder optimism):**
- "All devs need this" is false — most devs are comfortable building straight and don't feel this is a problem. The real target is the minority who are **already burned**.
- A good validation report is hard — if the verdict is generic ("great, keep going!"), it actually breaks the core differentiation.

**User journey map (MVP)**
Sign up (email/Google) → create project → write a 2–3 sentence idea → see the streaming validation report → (optional) answer clarifying questions → view & edit the feature tree → generate PRD → generate task breakdown → export markdown / copy Claude Code prompt → return anytime via history.

---

## 3. Product Strategy

**Product principles**
- **Validation is a feature, not a formality.** The validation gate always runs before the PRD. The user may skip it, but it's never hidden.
- **Editable at every stage.** The AI produces drafts, the user decides. Tree, PRD, tasks — all curatable.
- **Export-first.** The final output can always come out as markdown / a ready-to-paste prompt. This product serves the handoff, it doesn't cage the user.
- **Economy by default.** Cheap model for drafts, smart model for validation — the user needn't think about it, but may choose.

**Market differentiation**
Unlike ngodingpakeai and ChatPRD which are generation-first (writing PRDs immediately), Rancang Ide is **validation-first**: it questions the idea's viability first. Plus per-project persistence and export optimized for AI coding agents, with local context. Positioning: not "a faster PRD generator," but "stop building what nobody needs."

**Magic moment design**
The user types a 2-sentence idea, hits generate, and within ±2 minutes reads an honest verdict (strong/weak/pivot) + 3 fatal flaws + a draft feature tree. The "aha": *"Oh, this tool actually thinks with me, not just agrees with me."* This is fully achievable in the MVP.

**MVP definition**

_In scope:_
- Auth (Supabase: email + Google)
- Project CRUD + history
- Validation report generator (streaming): core assumption, fatal flaws, competition map, scorecard, verdict
- Feature tree editor (collapsible, editable, phase tags)
- PRD generator (markdown)
- Task breakdown generator (checkbox)
- Export markdown + copy-to-clipboard ("prompt for Claude Code")
- Free quota: 3 active projects (paywall stub, no payment gateway)
- Per-stage AI model selection (default economy, "deep" option)

_Explicitly out of scope (MVP):_
Full BRD, team collaboration, free-form canvas à la react-flow (tree view first), a real payment gateway, template marketplace, multi-language toggle, mobile app, user-facing analytics dashboard, Notion/Linear/GitHub integration, document versioning, BYOK API key.

**Feature priority (MoSCoW)**
- **Must:** Auth, project CRUD+history, validation report, feature tree editor, PRD generator, export markdown, free quota stub.
- **Should:** Task breakdown generator, per-stage model selection, streaming UX, clarifying questions in the validation stage.
- **Could:** Per-section regenerate, light-mode toggle, example/idea templates.
- **Won't (MVP):** Payment gateway, react-flow canvas, collaboration, external integrations, BRD, mobile.

**Core user flows**
1. **Idea → Validation:** input idea → streaming validation report → verdict + (optional) clarification.
2. **Validation → Structure:** generate feature tree → edit (rename/add/remove/tag phase).
3. **Structure → Spec:** generate PRD from the curated tree → generate task breakdown.
4. **Spec → Handoff:** export markdown / copy Claude Code prompt.
5. **Return:** open project from history → continue/regenerate.

**Success metrics**
- **North star:** % of users who create a 2nd project (retention to second generation).
- Activation: % of new users who complete 1 full pipeline (idea → export).
- Cost guardrail: AI cost per project ≤ target (computed at implementation; the basis for the free quota).
- Quality: % of users who export/copy the result (a proxy for "the spec was good enough to use").

**Risks**
- **Wrapper problem (High):** if value is only from AI text, there's no reason to stay vs. free chat. → Mitigation: value in the workflow + persistence + export.
- **Distribution (Medium, down from High):** a good product without traffic = a personal tool. The founder actually has a real distribution asset — GDG Depok organizer (1,800+ members) + speaking experience — so this risk is lower than initially assumed. → Mitigation: build-in-public from week one + activate the community network for early users & feedback.
- **Free-tier unit economics (Medium):** generation consumes tokens. → Mitigation: economy model by default, quota from real cost.
- **Scope creep / ADHD rabbit hole (Medium):** the temptation to add features & keep changing decisions. → Mitigation: locked MoSCoW, one magic moment.

---

## 4. Brand Strategy

**Positioning statement**
For Indonesian solo developers who already use AI coding agents but often build products that stall, Rancang Ide is a product sparring partner that validates the idea before spec'ing it — so time and credits aren't wasted on something nobody needs. Unlike PRD generators that write immediately, Rancang Ide dares to say "don't build this."

**Brand personality**
An honest, realistic sparring partner. Has opinions, dares to challenge, but always with reasons and for the builder's benefit. Casual, bilingual, not corporate — but not needlessly quirky either. Competent without arrogance.

**Voice & tone guide**

DO:
- Be direct and honest: "This idea is weak, here are 3 reasons."
- Give reasons, not just a verdict: always "because…".
- Casual bilingual in marketing (gw-lu), neutral-clear in-product.
- Celebrate real progress: "Blueprint ready. 8 modules, 24 tasks."

DON'T:
- Don't be an empty cheerleader: avoid "Great idea! Sure to succeed!" without basis.
- Don't over-use jargon or stiff corporate language.
- Don't judge the user (only the idea): the critique is on the idea, not the person.
- Don't fear-monger for drama; honest ≠ pessimistic.

**Messaging framework**
- **Core message:** Validate first, then build.
- **Pillar 1 — Honest:** a bold verdict, not a yes-man.
- **Pillar 2 — Structured:** from a messy idea to a neat blueprint.
- **Pillar 3 — Execution-ready:** output that can be handed straight to an AI coding agent.

**Elevator pitches**
- **5 seconds:** "Turn ideas into validated product blueprints — ready for Claude Code."
- **30 seconds:** "Rancang Ide is where you mature your side-project ideas. You type a 2-sentence idea, it gives an honest validation report — fatal flaws, worth-it-or-not verdict — then builds a feature tree, PRD, and task breakdown you can copy straight to Claude Code. The difference from other tools: it dares to say 'the idea is weak, don't build it' before writing the PRD."
- **2 minutes:** "As a dev who often builds side projects with AI coding agents, I kept getting burned: excited at first, three weeks later the scope is everywhere and the project dies. The problem isn't the coding — it's that I skip thinking about the product. Rancang Ide forces that stage back in: you write the idea, it validates first (assumption, fatal flaws, competition, verdict), then — if it's worth it — it builds an editable feature tree, turns it into a PRD, then breaks it into checkbox tasks ready for Claude Code. Everything saved per project. Other tools focus on writing a PRD as fast as possible; Rancang Ide focuses on making sure you write a PRD for the right idea. Freemium — 3 projects free, the rest Pro."

**Competitive differentiation narrative**
ngodingpakeai and ChatPRD win on document-writing speed and (for the local one) an existing audience. Rancang Ide doesn't fight on that lane; it opens a new one: **the validation gate**. Its real enemy isn't them, but the "just build" habit. If web retention ever proves weak, the pivot path is ready: become a skill/CLI companion for Claude Code, riding the already-crowded ecosystem.

---

_Next: `docs/prd.md` (technical spec) and `docs/product-roadmap.md` (build plan). Visual tokens: run the Design System skill for `docs/design.md`._
