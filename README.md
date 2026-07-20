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
[design.md](docs/design.md) (design tokens). Coding agents: read [CLAUDE.md](CLAUDE.md) first.

## Status

🚧 Phase 0 (foundation & scaffolding) — see the [roadmap](docs/product-roadmap.md).
