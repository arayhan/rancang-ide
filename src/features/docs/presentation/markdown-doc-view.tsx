"use client";

import { useObject } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { markdownDocSchema, type MarkdownDoc } from "@/features/docs/domain/schema";
import { downloadText } from "@/shared/lib/download";
import { Button } from "@/shared/ui/button";
import { LanguagePicker, useLanguage } from "@/shared/ui/language-picker";
import { Markdown } from "@/shared/ui/markdown";
import { ModelPicker, useModelTier } from "@/shared/ui/model-picker";
import { ModelTag } from "@/shared/ui/model-tag";

type StoredDoc = { id: string; doc: MarkdownDoc; modelUsed: string | null };

type MarkdownDocViewProps = {
  projectId: string;
  /** URL doc type, e.g. "brd" — posts to /api/docs/<type>. */
  type: string;
  fileSlug: string;
  blurb: string;
  prerequisiteHint?: string;
  available: boolean;
  document: StoredDoc | null;
};

const ctrl =
  "glow-ring rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:border-primary disabled:opacity-60";

export function MarkdownDocView({
  projectId,
  type,
  fileSlug,
  blurb,
  prerequisiteHint,
  available,
  document,
}: MarkdownDocViewProps) {
  const router = useRouter();
  const [tier, setTier] = useModelTier();
  const [language, setLanguage] = useLanguage();
  const { object, submit, isLoading, error } = useObject({
    api: `/api/docs/${type}`,
    schema: markdownDocSchema,
    onFinish: () => router.refresh(),
  });

  const generate = () => submit({ project_id: projectId, model: tier, language });

  if (document) {
    return (
      <StoredDocView
        documentId={document.id}
        doc={document.doc}
        fileSlug={fileSlug}
        modelUsed={document.modelUsed}
        onRegenerate={generate}
        regenerating={isLoading}
      />
    );
  }

  if (!isLoading && object === undefined) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="max-w-md text-muted">{blurb}</p>
        {!available && prerequisiteHint ? (
          <p className="text-sm text-muted">{prerequisiteHint}</p>
        ) : null}
        {error ? (
          <p className="text-sm text-error">
            Something went wrong. Check your quota or connection.
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <ModelPicker tier={tier} onChange={setTier} disabled={!available} />
          <LanguagePicker language={language} onChange={setLanguage} disabled={!available} />
        </div>
        <Button onClick={generate} disabled={!available}>
          Generate
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

function StoredDocView({
  documentId,
  doc,
  fileSlug,
  modelUsed,
  onRegenerate,
  regenerating,
}: {
  documentId: string;
  doc: MarkdownDoc;
  fileSlug: string;
  modelUsed: string | null;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [markdown, setMarkdown] = useState(doc.markdown);
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
        body: JSON.stringify({ content: { ...doc, markdown } }),
      });
      setSaved(res.ok);
    }, 800);
    return () => clearTimeout(timer);
  }, [markdown, documentId, doc]);

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
          <button onClick={() => downloadText(`${fileSlug}.md`, markdown)} className={ctrl}>
            ↓ .md
          </button>
          <button onClick={() => setEditing((v) => !v)} className={ctrl}>
            {editing ? "Preview" : "Edit"}
          </button>
          <button onClick={onRegenerate} disabled={regenerating} className={ctrl}>
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
