"use client";

import { useEffect, useRef, useState } from "react";

import type { FeatureTree, TreePhase } from "@/features/structure/domain/schema";
import { treeToMarkdown } from "@/features/structure/domain/tree-markdown";
import {
  addFeature,
  addModule,
  deleteFeature,
  deleteModule,
  emptyFeature,
  emptyModule,
  updateFeature,
  updateModule,
} from "@/features/structure/domain/tree";
import { downloadText } from "@/shared/lib/download";

const PHASE_OPTIONS: TreePhase[] = ["mvp", "v2", "later"];
const newId = () => crypto.randomUUID();

type SaveState = "idle" | "saving" | "saved";

const inputClass =
  "w-full rounded-sm border-2 border-border bg-transparent px-3 py-1.5 text-sm outline-none focus:border-primary";
const selectClass =
  "rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] outline-none focus:border-primary";
const iconBtnClass =
  "rounded-sm border-2 border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-error hover:text-error";

export function TreeEditor({
  documentId,
  initialTree,
}: {
  documentId: string;
  initialTree: FeatureTree;
}) {
  const [tree, setTree] = useState<FeatureTree>(initialTree);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [saveState, setSaveState] = useState<SaveState>("idle");
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

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {saveState === "saving"
            ? "Saving…"
            : saveState === "saved"
              ? "Saved ✓"
              : " "}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => downloadText("feature-tree.md", treeToMarkdown(tree))}
            className="glow-ring rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:border-primary"
          >
            ↓ .md
          </button>
          <button
            onClick={() => setTree((t) => addModule(t, emptyModule(newId)))}
            className="glow-ring rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors hover:border-primary"
          >
            + Module
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {tree.modules.map((module) => {
          const isCollapsed = collapsed.has(module.id);
          return (
            <li
              key={module.id}
              className="rounded-md border-2 border-border bg-surface p-3"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(module.id)}
                  aria-expanded={!isCollapsed}
                  aria-label={isCollapsed ? "Expand module" : "Collapse module"}
                  className="px-1 font-mono text-muted"
                >
                  {isCollapsed ? "▸" : "▾"}
                </button>
                <input
                  value={module.title}
                  placeholder="Module name"
                  onChange={(e) =>
                    setTree((t) => updateModule(t, module.id, { title: e.target.value }))
                  }
                  className={`${inputClass} font-medium`}
                />
                <select
                  value={module.phase}
                  aria-label="Module phase"
                  onChange={(e) =>
                    setTree((t) =>
                      updateModule(t, module.id, { phase: e.target.value as TreePhase }),
                    )
                  }
                  className={selectClass}
                >
                  {PHASE_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p.toUpperCase()}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setTree((t) => deleteModule(t, module.id))}
                  className={iconBtnClass}
                  aria-label="Delete module"
                >
                  ✕
                </button>
              </div>

              {!isCollapsed ? (
                <ul className="mt-3 flex flex-col gap-2 border-l-2 border-border pl-4">
                  {module.features.map((feature) => (
                    <li key={feature.id} className="flex items-center gap-2">
                      <input
                        value={feature.title}
                        placeholder="Feature"
                        onChange={(e) =>
                          setTree((t) =>
                            updateFeature(t, module.id, feature.id, {
                              title: e.target.value,
                            }),
                          )
                        }
                        className={inputClass}
                      />
                      <select
                        value={feature.phase}
                        aria-label="Feature phase"
                        onChange={(e) =>
                          setTree((t) =>
                            updateFeature(t, module.id, feature.id, {
                              phase: e.target.value as TreePhase,
                            }),
                          )
                        }
                        className={selectClass}
                      >
                        {PHASE_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          setTree((t) => deleteFeature(t, module.id, feature.id))
                        }
                        className={iconBtnClass}
                        aria-label="Delete feature"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() =>
                        setTree((t) => addFeature(t, module.id, emptyFeature(newId)))
                      }
                      className="font-mono text-xs uppercase tracking-[0.08em] text-accent hover:underline"
                    >
                      + Feature
                    </button>
                  </li>
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
