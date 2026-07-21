import * as Sentry from "@sentry/nextjs";

// Server error tracking. Disabled unless SENTRY_DSN is set, so it no-ops
// without configuration.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: Boolean(process.env.SENTRY_DSN),
  tracesSampleRate: 1,
});
