import { FREE_PROJECT_LIMIT } from "@/shared/domain/quota";

/**
 * Paywall stub — shown when a free user hits the project limit. Upgrade CTA
 * only (no payment gateway in MVP).
 */
export function Paywall() {
  return (
    <div className="ticks glow flex flex-col items-start gap-4 rounded-md border-2 border-border bg-surface p-6">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
        Free limit reached
      </span>
      <div>
        <h2 className="font-display text-xl font-semibold">
          You&apos;ve used all {FREE_PROJECT_LIMIT} free projects
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          Delete a project to free up a slot, or upgrade to Pro for unlimited
          projects. Everything you&apos;ve already built stays saved.
        </p>
      </div>
      <button
        type="button"
        disabled
        title="Payments arrive in a later release"
        className="glow-ring lift inline-flex h-11 cursor-not-allowed items-center rounded-sm bg-primary px-6 text-sm font-semibold text-white opacity-70"
      >
        Upgrade to Pro — coming soon
      </button>
    </div>
  );
}
