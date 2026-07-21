"use client";

import { useEffect, useRef, useState } from "react";

import type { FeatureTree } from "@/features/structure/domain/schema";
import { addModule, emptyModule } from "@/features/structure/domain/tree";
import { treeToMarkdown } from "@/features/structure/domain/tree-markdown";
import { downloadText } from "@/shared/lib/download";
import { ModelTag } from "@/shared/ui/model-tag";

import { TreeCanvas } from "./tree-canvas";
import { TreeEditor } from "./tree-editor";

const newId = () => crypto.randomUUID();
const toolBtn =
  "glow-ring rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors hover:border-primary";

/** Owns the tree state + autosave; toggles between the list editor and canvas. */
export function TreeWorkspace({
  documentId,
  initialTree,
  modelUsed,
}: {
  documentId: string;
  initialTree: FeatureTree;
  modelUsed?: string | null;
}) {
  const [tree, setTree] = useState<FeatureTree>(initialTree);
  const [view, setView] = useState<"list" | "canvas">("list");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const skipSave = useRef(true);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    setSaveState("saving");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/documents/${documentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: tree }),
        });
        setSaveState(res.ok ? "saved" : "idle");
      } catch {
        setSaveState("idle");
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [tree, documentId]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <ModelTag model={modelUsed} />
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved ✓" : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-sm border-2 border-border p-0.5">
            {(["list", "canvas"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`glow-ring rounded-[3px] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors ${
                  view === v ? "bg-primary text-white" : "text-muted hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => downloadText("feature-tree.md", treeToMarkdown(tree))}
            className={`${toolBtn} text-muted`}
          >
            ↓ .md
          </button>
          <button
            onClick={() => setTree((t) => addModule(t, emptyModule(newId)))}
            className={toolBtn}
          >
            + Module
          </button>
        </div>
      </div>

      {view === "canvas" ? (
        <TreeCanvas tree={tree} onChange={setTree} />
      ) : (
        <TreeEditor tree={tree} onChange={setTree} />
      )}
    </div>
  );
}
