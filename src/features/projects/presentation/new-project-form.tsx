"use client";

import { useActionState } from "react";

import type { CreateProjectState } from "@/features/projects/domain/types";
import { Button } from "@/shared/ui/button";

type NewProjectFormProps = {
  createProjectAction: (
    prevState: CreateProjectState,
    formData: FormData,
  ) => Promise<CreateProjectState>;
};

const fieldClass =
  "rounded-sm border-2 border-border bg-transparent px-4 py-3 text-foreground outline-none focus:border-primary";

export function NewProjectForm({ createProjectAction }: NewProjectFormProps) {
  const [state, formAction, pending] = useActionState<CreateProjectState, FormData>(
    createProjectAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field
        label="Your idea"
        htmlFor="ideaInput"
        hint="What are you building, and what problem does it solve? 2–3 sentences is plenty."
      >
        <textarea
          id="ideaInput"
          name="ideaInput"
          required
          minLength={10}
          rows={4}
          placeholder="e.g. A tool that turns a raw side-project idea into a validated blueprint — you type the idea, get an honest verdict on whether it's worth building, then a feature tree, PRD, and task list ready for Claude Code."
          className={fieldClass}
        />
      </Field>

      <Field
        label="Target user"
        htmlFor="targetUser"
        optional
        hint="Who is this for? The more specific, the sharper the validation."
      >
        <input
          id="targetUser"
          name="targetUser"
          placeholder="e.g. Indonesian solo devs who ship side projects at night with AI coding agents"
          className={fieldClass}
        />
      </Field>

      <Field
        label="Constraints"
        htmlFor="constraints"
        optional
        hint="Budget, timeline, team size, stack, platform — anything that bounds the build."
      >
        <textarea
          id="constraints"
          name="constraints"
          rows={2}
          placeholder="e.g. Solo founder, ~8 weeks, Next.js + Supabase, must run cheaply on free tiers, web-only"
          className={fieldClass}
        />
      </Field>

      <Field
        label="Anything else"
        htmlFor="context"
        optional
        hint="Competitors you know of, prior attempts, or notes the AI should consider."
      >
        <textarea
          id="context"
          name="context"
          rows={2}
          placeholder="e.g. Similar to ChatPRD but validation-first; I've tried building this twice and stalled on scope."
          className={fieldClass}
        />
      </Field>

      <Field
        label="Title"
        htmlFor="title"
        optional
        hint="We'll derive one from your idea if you leave this blank."
      >
        <input
          id="title"
          name="title"
          placeholder="e.g. Rancang Ide"
          className={fieldClass}
        />
      </Field>

      {state.error ? (
        <p className="text-sm text-[--error]" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Creating…" : "Create project"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-mono text-xs uppercase tracking-[0.08em] text-muted"
      >
        {label}
        {optional ? <span className="ml-2 normal-case text-muted/60">optional</span> : null}
      </label>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
      {children}
    </div>
  );
}
