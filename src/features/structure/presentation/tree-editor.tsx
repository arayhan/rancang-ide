"use client";

import { useState } from "react";

import type { FeatureTree, TreePhase } from "@/features/structure/domain/schema";
import {
  addFeature,
  deleteFeature,
  deleteModule,
  emptyFeature,
  updateFeature,
  updateModule,
} from "@/features/structure/domain/tree";

const PHASE_OPTIONS: TreePhase[] = ["mvp", "v2", "later"];
const newId = () => crypto.randomUUID();

const inputClass =
  "w-full rounded-sm border-2 border-border bg-transparent px-3 py-1.5 text-sm outline-none focus:border-primary";
const selectClass =
  "rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] outline-none focus:border-primary";
const iconBtnClass =
  "glow-ring rounded-sm border-2 border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-error hover:text-error";

/** Controlled list editor for a feature tree. Parent owns state + autosave. */
export function TreeEditor({
  tree,
  onChange,
}: {
  tree: FeatureTree;
  onChange: (tree: FeatureTree) => void;
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ul className="flex flex-col gap-3">
      {tree.modules.map((module) => {
        const isCollapsed = collapsed.has(module.id);
        return (
          <li key={module.id} className="rounded-md border-2 border-border bg-surface p-3">
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
                  onChange(updateModule(tree, module.id, { title: e.target.value }))
                }
                className={`${inputClass} font-medium`}
              />
              <select
                value={module.phase}
                aria-label="Module phase"
                onChange={(e) =>
                  onChange(
                    updateModule(tree, module.id, { phase: e.target.value as TreePhase }),
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
                onClick={() => onChange(deleteModule(tree, module.id))}
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
                        onChange(
                          updateFeature(tree, module.id, feature.id, {
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
                        onChange(
                          updateFeature(tree, module.id, feature.id, {
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
                      onClick={() => onChange(deleteFeature(tree, module.id, feature.id))}
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
                      onChange(addFeature(tree, module.id, emptyFeature(newId)))
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
  );
}
