# Features — layered architecture

Each feature (`validation`, `structure`, `prd`, `tasks`, `projects`, `auth`) has four layers:

```
<feature>/
  presentation/    # React components, screens
  application/     # use-cases, hooks (orchestration)
  domain/          # entities, zod schemas, pure business logic
  infrastructure/  # AI calls, repository implementations (DB/Supabase)
```

## Dependency rule

```
presentation → application → domain ← infrastructure
```

- **Inner layers never import outer layers.** `domain` imports nothing from the other
  three; `application` may import only `domain`.
- **`domain` is pure TypeScript** — zero framework/IO imports (no `next`, `react`,
  `drizzle-orm`, `@supabase/*`, `ai`). Only `zod` and other pure libs are allowed.
- **AI, DB, and Supabase live only in `infrastructure`.**
- Repository **interfaces** are declared in `domain`, **implemented** in
  `infrastructure` (dependency inversion). `application` depends on the interface;
  wiring happens at the edge (Route Handlers / Server Components in `src/app`).
- Cross-cutting code goes in `src/shared/{domain,ui,infrastructure,lib}` under the
  same rules (`shared/domain` pure, `shared/infrastructure` for clients).

These rules are enforced by ESLint (`eslint-plugin-boundaries`) — a violating import
fails `pnpm lint`.
