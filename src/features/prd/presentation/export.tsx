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
  prdMarkdown: string;
  tasks?: ExportTask[];
};

const btn =
  "rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors hover:border-primary";

export function ExportButtons({ title, prdMarkdown, tasks }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const download = () => {
    const md = buildProjectMarkdown({ title, prdMarkdown, tasks });
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toFileSlug(title)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(
      buildClaudeCodePrompt({ title, prdMarkdown, tasks }),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex gap-2">
      <button onClick={download} className={btn}>
        Download .md
      </button>
      <button onClick={copyPrompt} className={btn}>
        {copied ? "Copied ✓" : "Copy prompt"}
      </button>
    </div>
  );
}
