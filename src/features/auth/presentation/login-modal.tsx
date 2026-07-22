"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";

import type { MagicLinkState } from "@/features/auth/domain/types";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  signInWithMagicLink: (
    prevState: MagicLinkState,
    formData: FormData,
  ) => Promise<MagicLinkState>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub?: () => Promise<void>;
};

/** Casual login modal — Google OAuth (redirect) + email magic link. */
export function LoginModal({
  open,
  onClose,
  signInWithMagicLink,
  signInWithGoogle,
  signInWithGithub,
}: LoginModalProps) {
  const t = useTranslations("login");
  const dialogRef = useRef<HTMLDivElement>(null);
  const [state, formAction, pending] = useActionState<MagicLinkState, FormData>(
    signInWithMagicLink,
    {},
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="reveal ticks w-full max-w-sm rounded-lg border-2 border-border bg-surface p-7 shadow-[0_24px_60px_-20px_rgba(27,68,240,0.35)]"
      >
        <div className="mb-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {t("title")}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            {t("almostThere")}
          </h2>
          <p className="mt-2 text-sm text-muted">{t("modalSubtitle")}</p>
        </div>

        {state.sent ? (
          <div className="rounded-md border-2 border-border-strong bg-background-2 p-4">
            <p className="text-sm">{t("sentTitle")}</p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex flex-col gap-2">
              <form action={signInWithGoogle}>
                <button
                  type="submit"
                  className="glow-ring lift flex h-11 w-full items-center justify-center gap-2 rounded-sm border-2 border-border bg-surface text-sm font-semibold transition-colors hover:border-primary"
                >
                  <GoogleGlyph />
                  {t("continueWithGoogle")}
                </button>
              </form>
              {signInWithGithub ? (
                <form action={signInWithGithub}>
                  <button
                    type="submit"
                    className="glow-ring lift flex h-11 w-full items-center justify-center gap-2 rounded-sm border-2 border-border bg-surface text-sm font-semibold transition-colors hover:border-primary"
                  >
                    <GithubGlyph />
                    GitHub
                  </button>
                </form>
              ) : null}
            </div>

            <div className="my-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <span className="h-px flex-1 bg-border" />
              {t("or")}
              <span className="h-px flex-1 bg-border" />
            </div>

            <form action={formAction} className="flex flex-col gap-2">
              <label
                htmlFor="modal-email"
                className="sr-only"
              >
                {t("email")}
              </label>
              <input
                id="modal-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                className="glow-ring h-11 rounded-sm border-2 border-border bg-background-2 px-4 text-sm outline-none transition-colors focus:border-primary"
              />
              {state.error ? (
                <p className="text-xs text-error" role="alert">
                  {state.error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={pending}
                className="glow-ring lift h-11 rounded-sm bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {pending ? t("sending") : t("sendMagicLink")}
              </button>
            </form>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="glow-ring absolute right-4 top-4 rounded-sm border-2 border-transparent px-2 py-1 font-mono text-xs text-muted transition-colors hover:border-border"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function GithubGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.35-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.5.12-3.13 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.18 3.2-1.18.64 1.63.24 2.83.12 3.13.75.81 1.2 1.84 1.2 3.1 0 4.43-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.2.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.4 0 6.5 1.2 8.9 3.1l6.6-6.6C35.6 2.5 30.1.5 24 .5 14.8.5 6.9 5.8 3 13.5l7.7 6c1.9-5.6 7.2-9.9 13.3-9.9z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.2-3.1-.4-4.5H24v9.1h12.7c-.6 3-2.3 5.6-4.9 7.3l7.5 5.8c4.4-4.1 6.9-10.1 6.9-17.7z"
      />
      <path
        fill="#FBBC05"
        d="M10.7 28.5c-.5-1.4-.7-2.8-.7-4.5s.3-3.1.7-4.5l-7.7-6C1.1 16.8 0 20.3 0 24s1.1 7.2 3 10.5l7.7-6z"
      />
      <path
        fill="#34A853"
        d="M24 47.5c6.1 0 11.3-2 15.1-5.5l-7.5-5.8c-2.1 1.4-4.8 2.3-7.6 2.3-6.1 0-11.4-4.3-13.3-9.9l-7.7 6C6.9 42.2 14.8 47.5 24 47.5z"
      />
    </svg>
  );
}
