"use client";

import { useObject } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { prdDocumentSchema, type PrdDocument } from "@/features/prd/domain/schema";
import type { ModelTier } from "@/shared/domain/model";
import { Button } from "@/shared/ui/button";
import { Markdown } from "@/shared/ui/markdown";
import { ModelTag } from "@/shared/ui/model-tag";

type PrdViewProps = {
  projectId: string;
  document: { id: string; prd: PrdDocument } | null;
  hasTree: boolean;
  modelUsed?: string | null;
  tier?: ModelTier;
};

export function PrdView({
  projectId,
  document,
  hasTree,
  modelUsed,
  tier = "economy",
}: PrdViewProps) {
  const router = useRouter();
  const { object, submit, isLoading, error } = useObject({
    api: "/api/prd",
    schema: prdDocumentSchema,
    onFinish: () => router.refresh(),
  });

  if (document) {
    return (
      <PrdDocumentView
        documentId={document.id}
        prd={document.prd}
        modelUsed={modelUsed}
        onRegenerate={() => submit({ project_id: projectId, model: tier })}
        regenerating={isLoading}
      />
    );
  }

  if (!isLoading && object === undefined) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="max-w-md text-muted">
          Turn the feature tree into a ready-to-use PRD.
        </p>
        {!hasTree ? (
          <p className="text-sm text-muted">Generate the feature tree first.</p>
        ) : null}
        {error ? (
          <p className="text-sm text-error">
            Something went wrong. Check your quota or connection.
          </p>
        ) : null}
        <Button
          onClick={() => submit({ project_id: projectId, model: tier })}
          disabled={!hasTree}
        >
          Generate PRD
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="animate-pulse font-mono text-xs uppercase tracking-[0.08em] text-accent">
        Generating…
      </span>
      <div className="max-w-[720px]">
        <Markdown>{object?.markdown ?? ""}</Markdown>
      </div>
    </div>
  );
}

function PrdDocumentView({
  documentId,
  prd,
  modelUsed,
  onRegenerate,
  regenerating,
}: {
  documentId: string;
  prd: PrdDocument;
  modelUsed?: string | null;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [markdown, setMarkdown] = useState(prd.markdown);
  const [saved, setSaved] = useState(false);
  const skipSave = useRef(true);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    setSaved(false);
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: { ...prd, markdown } }),
      });
      setSaved(res.ok);
    }, 800);
    return () => clearTimeout(timer);
  }, [markdown, documentId, prd]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <ModelTag model={modelUsed} />
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
            {editing && saved ? "Saved ✓" : ""}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing((v) => !v)}
            className="rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors hover:border-primary"
          >
            {editing ? "Preview" : "Edit"}
          </button>
          <button
            onClick={onRegenerate}
            disabled={regenerating}
            className="rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors hover:border-primary disabled:opacity-60"
          >
            {regenerating ? "…" : "Regenerate"}
          </button>
        </div>
      </div>

      {editing ? (
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          rows={24}
          className="w-full rounded-md border-2 border-border bg-transparent p-3 font-mono text-sm outline-none focus:border-primary"
        />
      ) : (
        <article className="max-w-[720px]">
          <Markdown>{markdown}</Markdown>
        </article>
      )}
    </div>
  );
}
