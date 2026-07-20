# CLAUDE.md — Rancang Ide

## Product

**Rancang Ide** — a web app that turns a raw idea into a validated product blueprint
(idea → validation → feature tree → PRD → task breakdown) ready for an AI coding agent.
Validation-first, not generation-first: the app dares to say "don't build this."

Source of truth (read before coding, in this order):

1. `docs/product-vision.md` — strategy, personas, MoSCoW scope, brand voice
2. `docs/prd.md` — technical spec: architecture (§2), data model (§3), API (§4), requirements
3. `docs/product-roadmap.md` — phased task list (TASK-001 → TASK-043) with checkboxes
4. `docs/design.md` — design tokens (cobalt #1B44F0, Clash Display/Inter/JetBrains Mono, neo-brutalism)

If anything is ambiguous or conflicts: **STOP and ask the founder. Don't invent scope.**

## Stack (decided — do not substitute)

- Next.js (App Router) + TypeScript strict, Tailwind CSS
- Supabase (Postgres + Auth via `@supabase/ssr`), Drizzle ORM (migrations in-repo)
- Vercel AI SDK, provider-agnostic: Google Gemini Flash (default/economy), Anthropic Claude (deep)
- zod for all AI structured output (`streamObject`) — validate before persist, never save invalid output
- Deploy: Vercel. Observability (Phase 5): PostHog, Sentry, Resend
- Package manager: pnpm

## Architecture

Layered + feature-driven. **Dependency rule:**

```
presentation → application → domain ← infrastructure
```

- Inner layers never import outer layers.
- `domain/` is pure TypeScript: zero framework/IO imports (no next, react, drizzle, supabase, ai).
- AI, DB, and Supabase access live only in `infrastructure/`.
- Repository interfaces are declared in `domain/`, implemented in `infrastructure/` (dependency inversion).

```
src/
  app/                  # Next.js App Router (routes + Route Handlers only, thin)
  features/<feature>/   # validation | structure | prd | tasks | projects | auth
    presentation/       # components, screens
    application/        # use-cases, hooks
    domain/             # entities, zod schemas, pure logic
    infrastructure/     # AI calls, repository implementations
  shared/
    domain/             # cross-cutting entities & schemas
    ui/                 # design-system primitives
    infrastructure/     # supabase client, ai client factory, drizzle db
    lib/                # utils
  styles/               # globals.css, tokens.css
drizzle/                # schema + migrations
```

## Commands

- `pnpm dev` — run the dev server
- `pnpm lint` — ESLint (includes layer-boundary rules)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test` — vitest
- `pnpm build` — production build

## Workflow rules

- One roadmap task at a time, in order. Don't jump ahead.
- Definition of done per task: code + green lint/typecheck/test + roadmap checkbox `- [x]` + conventional commit.
- Don't install a new library without a one-sentence reason first.
- Never commit secrets. Keep `.env.example` complete; `.env*` stays gitignored.
- All AI calls server-side only (Route Handlers). Quota check before calling AI. Log every generation to `generations`.
- RLS on every user-owned table.
- Sanitize markdown on render (AI output is untrusted).
