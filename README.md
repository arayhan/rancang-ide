# Rancang Ide

Turn raw ideas into **validated product blueprints** — ready for an AI coding agent.

Most PRD generators write specs immediately. Rancang Ide is **validation-first**: you type a
2-sentence idea, it gives an honest verdict (strong / weak / pivot) with fatal flaws and a
competition map — and only then builds an editable feature tree, a PRD, and a task breakdown
you can hand straight to Claude Code. It dares to say *"don't build this."*

**Pipeline:** idea → validation report → feature tree → PRD → task breakdown → export markdown / copy prompt.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript strict + Tailwind CSS
- [Supabase](https://supabase.com) (Postgres + Auth) with [Drizzle ORM](https://orm.drizzle.team) (migrations in-repo)
- [Vercel AI SDK](https://ai-sdk.dev) — Google Gemini Flash (default/economy), Anthropic Claude (deep); all AI calls server-side, output validated with zod
- Deploy: Vercel · Observability: PostHog, Sentry, Resend

## Architecture

Layered + feature-driven — see [src/features/README.md](src/features/README.md):

```
presentation → application → domain ← infrastructure
```

The domain layer is pure TypeScript (zero framework/IO imports); AI/DB/Supabase live only in
infrastructure. The rule is enforced by ESLint (`eslint-plugin-boundaries`).

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in your keys (see comments in .env.example)
pnpm dev                     # http://localhost:3000
```

## Scripts

| Command          | What it does                     |
| ---------------- | -------------------------------- |
| `pnpm dev`       | dev server                       |
| `pnpm build`     | production build                 |
| `pnpm lint`      | ESLint (incl. boundary rules)    |
| `pnpm typecheck` | `tsc --noEmit`                   |
| `pnpm test`      | vitest                           |
| `pnpm format`    | Prettier                         |

## Docs

Product source of truth lives in [docs/](docs/): [product-vision.md](docs/product-vision.md) ·
[prd.md](docs/prd.md) · [product-roadmap.md](docs/product-roadmap.md) (task checkboxes) ·
[design.md](docs/design.md) (design tokens) · [cost-notes.md](docs/cost-notes.md) (AI cost & quota).
Coding agents: read [CLAUDE.md](CLAUDE.md) first.

## Cost & free quota

A full pipeline (validate → tree → PRD → tasks) on the economy tier (Gemini
Flash) measures **≈ 11k tokens ≈ $0.01–0.03**. The free quota of **3 active
projects** is set by product friction, not cost — details and the calibration
in [docs/cost-notes.md](docs/cost-notes.md). Every generation logs token counts
to the `generations` table, so this can be refreshed from production data.

## Status

Phases 0–4 complete (auth → projects → validation → tree → PRD → tasks → export),
verified live. Phase 5 (polish, quota, observability) in progress — see the
[roadmap](docs/product-roadmap.md).
