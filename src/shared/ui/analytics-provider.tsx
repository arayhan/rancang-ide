"use client";

import { useEffect } from "react";

import { initAnalytics } from "@/shared/lib/analytics";

/** Initializes PostHog on mount (no-op without a key). Renders nothing. */
export function AnalyticsProvider() {
  useEffect(() => {
    void initAnalytics();
  }, []);
  return null;
}
