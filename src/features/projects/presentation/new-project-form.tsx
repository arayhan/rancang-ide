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
    <form action={formAction} className="flex flex-col gap-3">
      <label
        htmlFor="ideaInput"
        className="font-mono text-xs uppercase tracking-[0.08em] text-muted"
      >
        Your idea
      </label>
      <textarea
        id="ideaInput"
        name="ideaInput"
        required
        minLength={10}
        rows={4}
        placeholder="Describe your product idea in 2–3 sentences…"
        className={fieldClass}
      />
      <input
        id="title"
        name="title"
        placeholder="Title (optional — we'll derive one from your idea)"
        className={fieldClass}
      />
      <textarea
        id="context"
        name="context"
        rows={2}
        placeholder="Optional context: target user, constraints, notes…"
        className={fieldClass}
      />
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
