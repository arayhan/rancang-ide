# Planning Brief — Rancang Ide
_Pre-fill for /product-planner. Every decision here is final unless marked (open)._

## 1. Vision
**One sentence:** The place where product ideas get matured — validated first, then blueprinted — so solo builders stop building things nobody needs.

**North star:** every project that leaves Rancang Ide has (a) an honest validation verdict, and (b) a spec an AI coding agent can execute immediately.

**Positioning vs. competitors:** validation-first (not generation-first), per-project persistence, export optimized for AI coding agents, bilingual Indo/English.

## 2. Target user & persona
**Primary (early adopter):** solo developer / indie hacker in Indonesia who already uses an AI coding agent (Claude Code, Cursor), has an idea backlog, and has experienced a side project dying from lack of direction. The founder himself is persona #1.

**Secondary (later):** technical founder at the pre-product stage; agency/software-house devs who need to draft a BRD/PRD quickly for clients.

**Non-target (for now):** enterprise PMs, large teams, non-technical founders who won't execute themselves.

## 3. Core user journey (MVP)
1. Login (Supabase auth — email + Google).
2. Create project → write a 2–3 sentence idea (+ optional: target user & context).
3. **Validation stage:** AI generates core assumption, fatal flaws (table), competition map, 6-axis scorecard, verdict strong/weak/pivot. The user can answer clarifying questions to sharpen it.
4. **Gate:** weak verdict → the app suggests discovery/pivot (the user may still proceed — we advise, not block).
5. **Structure stage:** AI generates a feature tree (module → sub-features), editable: rename, add/remove nodes, tag phases (MVP / v2 / later).
6. **PRD stage:** generate a markdown PRD per project from the curated tree — overview, personas, feature specs + acceptance criteria, non-goals, tech constraints.
7. **Task stage:** break the PRD into a checkbox task list, ordered, ready for an AI coding agent.
8. **Export:** copy/download markdown (prd.md, roadmap.md) + a "Copy prompt for Claude Code" button.
9. History: all projects & documents saved, reopenable and re-generatable.

## 4. Feature map (phased)
**MVP (phase 1):**
- Auth + project CRUD
- Validation report generator (with streaming output)
- Feature tree editor (collapsible tree view; not a free canvas)
- PRD generator + light markdown viewer/editor
- Task breakdown generator
- Export markdown / copy-to-clipboard
- Free quota: 3 active projects (paywall stub, no payment gateway yet)
- Per-stage AI model selection (default economy, "deep" option for validation)

**Phase 2:**
- Payment gateway (Midtrans/Xendit for local + Lemon Squeezy/Polar for global) (open: pick vendor)
- Free-form canvas à la react-flow for the tree (read/write)
- BRD & additional documents (vision doc, design brief)
- Per-section regenerate, document versioning
- Templates per product type (SaaS, mobile app, API, internal tool)

**Later:**
- Team/collab, comments
- Export integrations (Notion, Linear, GitHub issues)
- Mobile companion app (idea capture)
- Skill/CLI companion for Claude Code (also the pivot path if web retention is weak)

## 5. Monetization
- **Freemium.** Free: 3 active projects, economy model only, markdown export.
- **Pro (open: price, direction IDR 49–79k/month or ~$5 parity):** unlimited projects, "deep" model, unlimited regenerate, additional documents.
- Principle: the free quota is set from the real cost per generation, not a feeling.

## 6. Tech constraints (final)
- **Framework:** Next.js (App Router) + TypeScript strict.
- **DB/Auth:** Supabase (Postgres + Auth). ORM: Drizzle. Migrations via Drizzle, not the dashboard.
- **AI:** Vercel AI SDK — provider-agnostic; Gemini API as default (cost), Claude API as the "deep" option. All calls server-side; structured output via zod schema (structured output), not regex parsing.
- **Hosting:** Vercel.
- **Architecture:** layered (presentation → application → domain → infrastructure), feature-driven folders (`src/features/<feature>/…`), pure-TS domain layer. Strict dependency rule.
- **Streaming:** generation results streamed to the UI (AI SDK `streamObject`/`streamText`).

## 7. Design constraints (final)
- **Style:** neo-brutalism-lite — firm 2px borders, small hard shadow offset, 4–8px radius, ample whitespace, still readable & WCAG AA.
- **Color:** cobalt `#1B44F0` as primary; the rest monochrome (near-black, gray, white) + tints/shades of that blue for states. **No second accent color.** Minimal semantics: red for destructive/error, green for success — used sparingly.
- **Font:** Clash Display (heading), Inter (body), JetBrains Mono (document/code output).
- **Mode:** dark mode default, light mode available.
- Visual identity: a "blueprint" motif (fine grid, technical lines) may be used thinly in the background.

## 8. Non-goals (MVP)
Not a project management tool, not a Jira/Linear replacement, not a general chat assistant, not a team collaboration tool, does not store user API keys (BYOK considered later).

## 9. Metrics
- Activation: % of new users who complete 1 full pipeline (idea → export).
- **North metric: % of users who create a 2nd project** (retention to second generation).
- Cost guardrail: AI cost per project ≤ target (computed at implementation).

## 10. Risks (from the validation report)
1. Wrapper problem → mitigation: value in the workflow (validation gate, tree editing, persistence, export), not the AI text.
2. Distribution → mitigation: build-in-public from week one + activate the GDG Depok community; content = your own idea's validation report.
3. Free-tier unit economics → mitigation: economy model by default, quota computed from real cost.
