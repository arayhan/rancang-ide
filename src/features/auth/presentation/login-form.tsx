"use client";

import { useActionState } from "react";

import type { MagicLinkState } from "@/features/auth/domain/types";

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
    <div className="flex w-full max-w-sm flex-col gap-6">
      {state.sent ? (
        <p className="rounded-md border border-border bg-[--surface] p-4 text-sm">
          Check your email — we sent you a magic link to sign in.
        </p>
      ) : (
        <form action={formAction} className="flex flex-col gap-3">
          <label
            htmlFor="email"
            className="font-mono text-xs uppercase tracking-[0.08em] text-muted"
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
            className="h-12 rounded-sm border-2 border-border bg-transparent px-4 text-foreground outline-none focus:border-primary"
          />
          {state.error ? (
            <p className="text-sm text-[--error]" role="alert">
              {state.error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="h-11 rounded-sm bg-primary px-6 font-medium text-white transition-colors hover:bg-[--accent] disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send magic link"}
          </button>
        </form>
      )}

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="h-11 w-full rounded-sm border-2 border-border px-6 font-medium transition-colors hover:border-primary"
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
}
