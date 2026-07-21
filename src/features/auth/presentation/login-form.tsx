"use client";

import { useActionState } from "react";

import type { MagicLinkState } from "@/features/auth/domain/types";
import { Button } from "@/shared/ui/button";

type LoginFormProps = {
  signInWithMagicLink: (
    prevState: MagicLinkState,
    formData: FormData,
  ) => Promise<MagicLinkState>;
  signInWithGoogle: () => Promise<void>;
};

export function LoginForm({ signInWithMagicLink, signInWithGoogle }: LoginFormProps) {
  const [state, formAction, pending] = useActionState<MagicLinkState, FormData>(
    signInWithMagicLink,
    {},
  );

  return (
    <div className="flex w-full flex-col gap-5">
      {state.sent ? (
        <div className="ticks glow rounded-md border-2 border-border-strong bg-surface-raised p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            Link sent
          </p>
          <p className="mt-2 text-sm text-muted">
            Check your email for the magic link. It may take a minute — peek in spam if
            it&apos;s shy.
          </p>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-3">
          <label
            htmlFor="email"
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="glow-ring h-12 rounded-sm border-2 border-border bg-background-2 px-4 text-foreground transition-colors"
          />
          {state.error ? (
            <p className="text-sm text-error" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" disabled={pending} className="h-12 w-full">
            {pending ? "Sending…" : "Send magic link"}
          </Button>
        </form>
      )}

      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={signInWithGoogle}>
        <Button type="submit" variant="secondary" className="h-12 w-full">
          Continue with Google
        </Button>
      </form>
    </div>
  );
}
