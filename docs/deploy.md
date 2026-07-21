# Deploy runbook — Rancang Ide

How to deploy and configure the app on Vercel + Supabase. Secrets never live in
this file — keep them in `.env.local` (gitignored) and Vercel env vars.

## Live URLs

- **Production:** <https://rancang-ide.vercel.app>
- **Health check:** `GET /api/health` → `{"status":"ok"}`
- **Vercel project:** `arayhans-projects/rancang-ide` (Git-connected → auto-deploys on push to `main`)
- **Supabase project:** `rancang-ide` (ref `fyeirysvrintohuybnld`, region `ap-south-1`)

## Environment variables

Set in Vercel (**Project → Settings → Environment Variables**) for **Production**
and **Preview**. The app reads:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | anon/publishable key |
| `DATABASE_URL` | ✅ | Supabase **transaction pooler** URI (port 6543), password URL-encoded |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ | Gemini key (economy tier) |
| `NEXT_PUBLIC_SITE_URL` | ⚪ | auth-redirect fallback; prod = the production URL |
| `ANTHROPIC_API_KEY` | ⚪ | required for the "Deep" model tier |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` | ⚪ | analytics; no-op if unset |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | ⚪ | error tracking; no-op if unset |
| `RESEND_API_KEY` | ⚪ | transactional email; no-op if unset |

The optional integrations are guarded no-ops — the app builds and runs fine
without them, and each activates purely by setting its key.

### Adding a var from the CLI (without re-typing secrets)

```bash
# read the value from .env.local and pipe it in, for one environment
printf '%s' "$(grep '^GOOGLE_GENERATIVE_AI_API_KEY=' .env.local | cut -d= -f2-)" \
  | vercel env add GOOGLE_GENERATIVE_AI_API_KEY production
```

`DATABASE_URL` note: `db.<ref>.supabase.co` (direct, 5432) often does not resolve
on IPv4 networks — use the **pooler** host (`aws-1-ap-south-1.pooler.supabase.com:6543`,
user `postgres.<ref>`) and URL-encode special characters in the password.

## ⚠️ Supabase Auth redirect URLs (required for login)

Supabase only completes a magic-link / OAuth sign-in if the redirect target is on
its allow-list. **After any new deploy domain, add it in the Supabase dashboard →
Authentication → URL Configuration:**

- **Site URL:** `https://rancang-ide.vercel.app`
- **Redirect URLs:** `https://rancang-ide.vercel.app/**`
- Keep local dev too: `http://localhost:3000/**` (or `:3100/**` if that port is in use)

Without this, sign-in from the deployed site bounces back to `/login`. This is a
dashboard-only step — it is not covered by the env vars above.

Also, for **Google** OAuth, enable the Google provider in Supabase → Authentication
→ Providers and set the client ID/secret (magic link needs no provider setup).

## Deploy

Auto-deploy: push to `main` (GitHub is connected). Manual/immediate:

```bash
vercel deploy --prod --yes
```

Env-var changes do **not** auto-redeploy — trigger a deploy after editing them.

## Database migrations

Migrations live in `drizzle/migrations` and are applied to Supabase (not the
dashboard). Apply new ones with:

```bash
pnpm db:generate   # after editing drizzle/schema.ts
pnpm db:migrate    # apply to DATABASE_URL
```

RLS is enabled on every user-owned table; policies ship inside the migrations.

## Post-deploy smoke check

```bash
curl -s https://rancang-ide.vercel.app/api/health           # {"status":"ok"}
curl -s -o /dev/null -w '%{http_code}' https://rancang-ide.vercel.app/login     # 200
curl -s -o /dev/null -w '%{http_code}' https://rancang-ide.vercel.app/projects  # 307 -> /login
```

Then sign in and run one validation to confirm Supabase + Gemini are reachable.
See `docs/cost-notes.md` for token/cost expectations.
