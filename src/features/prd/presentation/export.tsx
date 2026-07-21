"use client";

import { useState } from "react";

import {
  buildClaudeCodePrompt,
  buildProjectMarkdown,
  toFileSlug,
  type ExportTask,
} from "@/shared/lib/markdown";

type ExportButtonsProps = {
  title: string;
  /** Null until the PRD exists — export needs the blueprint body. */
  prdMarkdown: string | null;
  tasks?: ExportTask[];
};

const btn =
  "glow-ring rounded-sm border-2 border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border";

export function ExportButtons({ title, prdMarkdown, tasks }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);
  const ready = Boolean(prdMarkdown);

  const download = () => {
    if (!prdMarkdown) return;
    const md = buildProjectMarkdown({ title, prdMarkdown, tasks });
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toFileSlug(title)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF via the browser's print-to-PDF, scoped to the hidden .print-doc region.
  const downloadPdf = () => {
    if (!prdMarkdown) return;
    window.print();
  };

  const copyPrompt = async () => {
    if (!prdMarkdown) return;
    await navigator.clipboard.writeText(
      buildClaudeCodePrompt({ title, prdMarkdown, tasks }),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (!ready) {
    return (
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex gap-2 opacity-50">
          <span className={btn}>Download .md</span>
          <span className={btn}>PDF</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
          Generate the PRD to export
        </span>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 flex-wrap gap-2">
      <button onClick={download} className={btn}>
        Download .md
      </button>
      <button onClick={downloadPdf} className={btn}>
        PDF
      </button>
      <button onClick={copyPrompt} className={btn}>
        {copied ? "Copied ✓" : "Copy prompt"}
      </button>
    </div>
  );
}
