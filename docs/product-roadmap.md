# Product Roadmap — Rancang Ide

_Phased build plan. Read `docs/product-vision.md` and `docs/prd.md` first. The coding agent marks `- [ ]` → `- [x]` as tasks complete._

---

## Build Philosophy

- **Every phase is demoable.** No phase leaves the app broken. The end of each phase = something you can open and use.
- **Magic moment as early as possible.** Idea → validation report must be live by the end of Phase 2, not the end of the project.
- **Layered + feature-driven, strict.** Pure-TS domain. AI/DB/Supabase only in infrastructure. One feature = one folder with 4 layers.
- **One task at a time.** Implement → test/typecheck → check the box → conventional commit. Ambiguous → ask, don't invent.
- **Economy & safety by default.** AI calls server-side, output zod-validated before persist, every generation logged to `generations`.

---

## Phase 0 — Foundation & Scaffolding

**Goal:** Repo runs, architecture stands, CI green, an empty app can deploy to Vercel.
**Demoable outcome:** `pnpm dev` runs; empty page deployed; lint/typecheck/test green in CI.

**Agent session prompt:** "Read docs/prd.md §2 (Architecture) and docs/product-vision.md. Do TASK-001 through TASK-008 in order. After each task: typecheck + test + commit. Don't start features before scaffolding & CI are green."

- [x] **TASK-001** — Init Next.js (App Router, TypeScript strict) + pnpm; set up Tailwind CSS.
      Files: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `src/styles/globals.css`
      Notes: TS strict true. Tailwind ready to receive design tokens from `docs/design.md`.
- [x] **TASK-002** — Create the layered + feature-driven folder structure per PRD §2 (features/{validation,structure,prd,tasks,projects,auth}/{presentation,application,domain,infrastructure}, shared/).
      Files: `src/features/.gitkeep`, `src/shared/.gitkeep`
      Notes: Add a short README under features/ explaining the dependency rule.
- [x] **TASK-003** — Set up ESLint + Prettier + import boundary rule (forbid domain importing framework/infra).
      Files: `.eslintrc`, `.prettierrc`
      Notes: Use eslint-plugin-boundaries or similar to enforce layers.
- [x] **TASK-004** — Set up vitest for domain + shared unit tests.
      Files: `vitest.config.mts`, `src/shared/domain/__tests__/sample.test.ts`
      Notes: One dummy test to confirm the test pipeline runs.
- [x] **TASK-005** — GitHub Actions: lint + typecheck + test on PR.
      Files: `.github/workflows/ci.yml`
      Notes: Node LTS, pnpm cache.
- [x] **TASK-006** — Complete `.env.example` (Supabase URL/anon/service, Gemini, Anthropic, Resend, Sentry DSN, PostHog key).
      Files: `.env.example`
      Notes: NEVER commit `.env`. Document each var briefly.
- [x] **TASK-007** — Set up the Supabase client (SSR) + Drizzle in shared/infrastructure.
      Files: `src/shared/infrastructure/supabase/{server,client}.ts`, `src/shared/infrastructure/db/index.ts`, `drizzle.config.ts`
      Notes: `@supabase/ssr`. Drizzle pointing at Supabase Postgres.
- [x] **TASK-008** — Deploy the skeleton to Vercel; empty landing page + health route.
      Files: `src/app/page.tsx`, `src/app/api/health/route.ts`
      Notes: Ensure env is set in Vercel. Commit + verify the deploy is green.

---

## Phase 1 — Auth & Projects

**Goal:** Users can log in and manage projects (CRUD + history) — no AI yet.
**Demoable outcome:** Google/email login, create a project, see it in history, open, delete.

**Agent session prompt:** "Do TASK-009 through TASK-016. Auth uses Supabase (@supabase/ssr) per PRD §9. All tables have RLS enabled. Test use-cases in domain/application."

- [x] **TASK-009** — Drizzle schema: `profiles`, `projects` + migration; enable RLS + policy `auth.uid()=user_id`.
      Files: `drizzle/schema.ts`, `drizzle/migrations/*`
      Notes: `profiles.plan` enum('free','pro') default free. `projects.status` enum.
- [x] **TASK-010** — Supabase Auth: login page (email magic link + Google OAuth) + callback + logout.
      Files: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/callback/route.ts`, `src/features/auth/**`
      Notes: On first login upsert a `profiles` row.
- [x] **TASK-011** — Route protection: `(app)` group redirects to /login if unauth.
      Files: `src/app/(app)/layout.tsx`, `src/shared/infrastructure/supabase/server.ts`
      Notes: Read the session in a Server Component.
- [x] **TASK-012** — Domain + zod schema for Project; repository interface in domain, Drizzle impl in infrastructure.
      Files: `src/features/projects/domain/*`, `src/features/projects/infrastructure/*`
      Notes: Pure-TS domain. Repo interface in domain, impl in infra (dependency inversion).
- [x] **TASK-013** — Route Handlers for projects: POST/GET list/GET one/DELETE.
      Files: `src/app/api/projects/route.ts`, `src/app/api/projects/[id]/route.ts`
      Notes: Auth required; filter by user.
- [x] **TASK-014** — UI: Dashboard/History (list + empty state) & New Project form (idea textarea + optional context).
      Files: `src/app/(app)/projects/page.tsx`, `src/features/projects/presentation/*`
      Notes: Empty-state CTA "Create your first project". Use shared/ui primitives.
- [x] **TASK-015** — UI: Project detail shell (tabs/stages: Validation, Structure, PRD, Tasks — still empty).
      Files: `src/app/(app)/projects/[id]/page.tsx`
      Notes: Stage navigation ready to be filled in later phases.
- [x] **TASK-016** — Test: create/list/delete project use-cases + RLS smoke test.
      Files: `src/features/projects/application/__tests__/*`
      Notes: Ensure a user can't access another user's project.

---

## Phase 2 — Validation (MAGIC MOMENT)

**Goal:** Idea → streaming validation report. This is the core differentiator.
**Demoable outcome:** Type an idea → ±2 minutes → verdict + fatal flaws + competition + scorecard, saved.

**Agent session prompt:** "Do TASK-017 through TASK-023. AI via the Vercel AI SDK, server-side only, output zod-validated (streamObject). Default Gemini Flash. Log to `generations`."

- [x] **TASK-017** — AI client factory in shared/infrastructure: provider switch Gemini(default)/Claude(deep) via the Vercel AI SDK.
      Files: `src/shared/infrastructure/ai/index.ts`
      Notes: `@ai-sdk/google`, `@ai-sdk/anthropic`. Keys server-only.
- [x] **TASK-018** — Zod schema for the validation result (core_assumption, fatal_flaws[], competition, scorecard, verdict enum) in the feature domain.
      Files: `src/features/validation/domain/schema.ts`
      Notes: verdict ∈ strong|weak|pivot. This is the AI output contract.
- [x] **TASK-019** — Prompt + validation use-case (application) + infra call (streamObject).
      Files: `src/features/validation/application/*`, `src/features/validation/infrastructure/*`
      Notes: The prompt adopts the idea-validator framework (assumption, flaws, competition, scorecard, verdict) + local context.
- [x] **TASK-020** — Drizzle schema `validations` + `generations` + migration + RLS.
      Files: `drizzle/schema.ts`, `drizzle/migrations/*`
      Notes: Persist the report jsonb + model_used + token counts.
- [x] **TASK-021** — Route Handler `POST /api/validate` (streaming) + quota check before calling AI.
      Files: `src/app/api/validate/route.ts`
      Notes: Free & active projects ≥3 → `{error:'quota_exceeded'}`. Write a generations row.
- [x] **TASK-022** — UI Validation View: streaming report, verdict badge, flaws list, competition, scorecard; empty/loading/error+retry states.
      Files: `src/features/validation/presentation/*`
      Notes: Semantic colors used sparingly (red/green) over the cobalt base. Skeleton while streaming.
- [ ] **TASK-023** — Test: schema parse (valid/invalid AI output), quota guard, use-case.
      Files: `src/features/validation/**/__tests__/*`
      Notes: Invalid output → reject, don't persist.

---

## Phase 3 — Structure (Feature Tree)

**Goal:** Generate an editable feature tree from the idea/validation.
**Demoable outcome:** A collapsible tree appears; the user renames/adds/deletes nodes & tags phases; saved.

**Agent session prompt:** "Do TASK-024 through TASK-028. The tree = vertical collapsible (NOT a free react-flow canvas — that's a later phase). AI output zod-validated."

- [ ] **TASK-024** — Zod schema for the tree (nodes: module→sub-features, phase field MVP/v2/later) in domain.
      Files: `src/features/structure/domain/schema.ts`
- [ ] **TASK-025** — Use-case + infra to generate the tree (Gemini default) + `POST /api/structure` streaming + quota + generations.
      Files: `src/features/structure/application/*`, `src/features/structure/infrastructure/*`, `src/app/api/structure/route.ts`
- [ ] **TASK-026** — Persist the tree to `documents(type=tree)` (documents schema + migration + RLS if not present).
      Files: `drizzle/schema.ts`, `drizzle/migrations/*`
- [ ] **TASK-027** — UI Tree View: collapsible, editable nodes (rename/add/delete), phase badges, autosave via `PATCH /api/documents/:id`.
      Files: `src/features/structure/presentation/*`, `src/app/api/documents/[id]/route.ts`
      Notes: Keyboard accessible. Neo-brutalist node cards.
- [ ] **TASK-028** — Test: tree schema, edit ops, persistence.
      Files: `src/features/structure/**/__tests__/*`

---

## Phase 4 — PRD & Tasks + Export

**Goal:** Curated tree → PRD markdown → task breakdown → export/copy. The full pipeline is complete.
**Demoable outcome:** From the tree, generate the PRD, generate tasks, copy the Claude Code prompt / download markdown.

**Agent session prompt:** "Do TASK-029 through TASK-035. PRD & tasks streaming, zod-validated, persisted to documents. Export = valid markdown + copy-to-clipboard."

- [ ] **TASK-029** — Zod schema for PRD (markdown+meta) & Tasks (task[] checkbox) in their respective domains.
      Files: `src/features/prd/domain/schema.ts`, `src/features/tasks/domain/schema.ts`
- [ ] **TASK-030** — Use-case + infra PRD generator from the tree + `POST /api/prd` streaming + quota + generations.
      Files: `src/features/prd/application/*`, `src/features/prd/infrastructure/*`, `src/app/api/prd/route.ts`
- [ ] **TASK-031** — Use-case + infra Tasks generator from the PRD + `POST /api/tasks` streaming + quota + generations.
      Files: `src/features/tasks/**`, `src/app/api/tasks/route.ts`
- [ ] **TASK-032** — Persist PRD & tasks to `documents` (type=prd|tasks).
      Files: `src/features/{prd,tasks}/infrastructure/*`
- [ ] **TASK-033** — UI PRD View (markdown viewer + light edit + regenerate) & Tasks View (checklist).
      Files: `src/features/prd/presentation/*`, `src/features/tasks/presentation/*`
      Notes: Sanitize markdown on render (XSS). JetBrains Mono for output blocks.
- [ ] **TASK-034** — Export: download `.md` + copy-to-clipboard ("prompt for Claude Code") with "Copied" feedback.
      Files: `src/features/prd/presentation/export.tsx`, `src/shared/lib/markdown.ts`
- [ ] **TASK-035** — Test: PRD/tasks schema, valid export markdown, regenerate doesn't delete other documents.
      Files: `src/features/{prd,tasks}/**/__tests__/*`

---

## Phase 5 — Polish, Quota & Launch-ready

**Goal:** Quota stub, model picker, observability, accessibility, ready to dogfood + build-in-public.
**Demoable outcome:** The app is pleasant end-to-end; the free quota works; errors are caught; activation metrics are recorded.

**Agent session prompt:** "Do TASK-036 through TASK-043. Focus on polish, not new features. Ensure the magic moment is smooth and cost is measured."

- [ ] **TASK-036** — Paywall stub on the 4th active project (free) + upgrade CTA UI (no payment).
      Files: `src/features/projects/presentation/paywall.tsx`
- [ ] **TASK-037** — Per-stage model picker (default economy / deep option); save the preference; record `model_used`.
      Files: `src/shared/ui/model-picker.tsx`, integrated into each generation view
- [ ] **TASK-038** — Rate limiting on the generation endpoints per user.
      Files: `src/shared/infrastructure/ratelimit.ts`
      Notes: Prevent abuse & control cost.
- [ ] **TASK-039** — PostHog integration (funnel: signup→validate→structure→prd→export; 2nd-project event).
      Files: `src/shared/infrastructure/analytics.ts`
- [ ] **TASK-040** — Sentry integration (client+server) + Resend (verification/notification email).
      Files: `sentry.*.config.ts`, `src/shared/infrastructure/email.ts`
- [ ] **TASK-041** — Apply the design tokens from `docs/design.md` (cobalt #1B44F0, Clash Display/Inter/JetBrains Mono, neo-brutalism-lite) to shared/ui.
      Files: `src/styles/tokens.css`, `src/shared/ui/*`
      Notes: Prerequisite: run the Design System skill first if `docs/design.md` doesn't exist.
- [ ] **TASK-042** — Accessibility audit (contrast over cobalt, keyboard focus, states) + empty/loading/error on all screens.
      Files: all presentation
- [ ] **TASK-043** — Measure real cost per pipeline; calibrate the free quota; write notes in the README.
      Files: `README.md`, `docs/cost-notes.md`
      Notes: This closes the free-quota Open Question in PRD §14.

---

## Agent Session Guide

- **Always read first:** `CLAUDE.md`, then the relevant section of `docs/prd.md` before each phase.
- **One task at a time**, in order TASK-001 → TASK-043. Don't jump around.
- **Definition of done per task:** code + green test/typecheck + checkbox checked (`- [x]`) + conventional commit.
- **Ambiguous/conflicts with the PRD → STOP & ask the founder.** Don't invent scope.
- **Don't install new libraries** without a one-sentence reason.
- **Definition of done MVP (end of Phase 4):** login → write idea → validation report → tree edit → PRD → tasks → export, all working; projects saved & reopenable.
- **Final UI prerequisite:** `docs/design.md` (Design System skill) must exist before TASK-041.
- **Phase order = risk order.** The magic moment (Phase 2) deliberately comes before completeness (Phases 3–4) so it can be validated quickly.
