"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";

import type { MagicLinkState } from "@/features/auth/domain/types";
import { LoginModal } from "@/features/auth/presentation/login-modal";
import type { CreateProjectState } from "@/features/projects/domain/types";

import {
  clearPendingIdea,
  readPendingIdea,
  savePendingIdea,
} from "./pending-idea";

type ChatEntryProps = {
  authed: boolean;
  createProjectAction: (
    prevState: CreateProjectState,
    formData: FormData,
  ) => Promise<CreateProjectState>;
  signInWithMagicLink: (
    prevState: MagicLinkState,
    formData: FormData,
  ) => Promise<MagicLinkState>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub?: () => Promise<void>;
};

const fieldClass =
  "glow-ring w-full rounded-sm border-2 border-border bg-background-2 px-4 py-3 text-sm outline-none transition-colors focus:border-primary";

/**
 * Chat-style entry: an idea input as the hero. If not signed in, submit
 * opens a login modal and stashes the idea in localStorage — after auth,
 * the draft is auto-restored + submitted.
 */
export function ChatEntry({
  authed,
  createProjectAction,
  signInWithMagicLink,
  signInWithGoogle,
  signInWithGithub,
}: ChatEntryProps) {
  const t = useTranslations("chat");
  const [state, formAction, pending] = useActionState<CreateProjectState, FormData>(
    createProjectAction,
    {},
  );

  // Read any pending idea once at mount (SSR-safe: null on the server, real
  // value after hydration). Populates the fields via useState initializers so
  // we never call setState synchronously inside an effect.
  const initialDraft = useState(() => readPendingIdea())[0];
  const [showDetails, setShowDetails] = useState(
    Boolean(
      initialDraft?.targetUser || initialDraft?.constraints || initialDraft?.notes,
    ),
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [ideaInput, setIdeaInput] = useState(initialDraft?.ideaInput ?? "");
  const [targetUser, setTargetUser] = useState(initialDraft?.targetUser ?? "");
  const [constraints, setConstraints] = useState(initialDraft?.constraints ?? "");
  const [notes, setNotes] = useState(initialDraft?.notes ?? "");
  const formRef = useRef<HTMLFormElement>(null);

  // If we came back with a saved draft AND we're signed in, auto-submit it.
  const autoSubmittedRef = useRef(false);
  useEffect(() => {
    if (!authed || autoSubmittedRef.current || !initialDraft) return;
    autoSubmittedRef.current = true;
    clearPendingIdea();
    // Yield a tick so React commits the values before submit fires.
    setTimeout(() => formRef.current?.requestSubmit(), 0);
  }, [authed, initialDraft]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!authed) {
      e.preventDefault();
      // Stash the draft so it survives the OAuth redirect.
      savePendingIdea({
        ideaInput,
        targetUser: targetUser || undefined,
        constraints: constraints || undefined,
        notes: notes || undefined,
      });
      setModalOpen(true);
    }
  };

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <label htmlFor="idea" className="sr-only">
          {t("greeting")}
        </label>
        <div className="relative">
          <textarea
            id="idea"
            name="ideaInput"
            required
            minLength={10}
            rows={4}
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            placeholder={t("placeholder")}
            className={`${fieldClass} resize-none text-base leading-relaxed`}
          />
          <span className="pointer-events-none absolute -left-3 top-4 hidden h-6 w-0.5 rounded-full bg-accent md:block" />
        </div>

        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="glow-ring self-start rounded-sm border-2 border-transparent px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-border hover:text-foreground"
          aria-expanded={showDetails}
        >
          {showDetails ? "− " : "+ "}
          {t("detailsHint")}
        </button>

        {showDetails ? (
          <div className="reveal flex flex-col gap-3 rounded-md border border-dashed border-border p-4">
            <FieldRow label={t("targetUser")}>
              <input
                name="targetUser"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
                placeholder={t("targetUserPlaceholder")}
                className={fieldClass}
              />
            </FieldRow>
            <FieldRow label={t("constraints")}>
              <textarea
                name="constraints"
                rows={2}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder={t("constraintsPlaceholder")}
                className={fieldClass}
              />
            </FieldRow>
            <FieldRow label={t("notes")}>
              <textarea
                name="context"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("notesPlaceholder")}
                className={fieldClass}
              />
            </FieldRow>
          </div>
        ) : null}

        {state.error ? (
          <p className="text-sm text-error" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="glow-ring lift group inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? t("submitting") : t("submit")}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          {!authed ? (
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {t("loginNudge")}
            </span>
          ) : null}
        </div>
      </form>

      <LoginModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        signInWithMagicLink={signInWithMagicLink}
        signInWithGoogle={signInWithGoogle}
        signInWithGithub={signInWithGithub}
      />
    </>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}
