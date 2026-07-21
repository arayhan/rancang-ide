import * as Sentry from "@sentry/nextjs";

// Edge runtime error tracking. Disabled unless SENTRY_DSN is set.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: Boolean(process.env.SENTRY_DSN),
  tracesSampleRate: 1,
});
