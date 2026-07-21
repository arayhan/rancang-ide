/**
 * PostHog analytics wrapper (client-side). No-ops unless
 * NEXT_PUBLIC_POSTHOG_KEY is set. Lives in shared/lib (not infrastructure) so
 * presentation may fire funnel events without crossing the layer boundary.
 *
 * PostHog is loaded lazily, so it isn't bundled when analytics is disabled.
 */

type PostHog = Awaited<typeof import("posthog-js")>["default"];

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

let client: PostHog | null = null;

/** Initialize PostHog once, in the browser, if a key is configured. */
export async function initAnalytics(): Promise<void> {
  if (client || !KEY || typeof window === "undefined") return;
  const posthog = (await import("posthog-js")).default;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: true,
    person_profiles: "identified_only",
  });
  client = posthog;
}

/** Funnel event (signup → validate → structure → prd → export, 2nd project). */
export function capture(event: string, props?: Record<string, unknown>): void {
  client?.capture(event, props);
}

export function identify(distinctId: string, props?: Record<string, unknown>): void {
  client?.identify(distinctId, props);
}
