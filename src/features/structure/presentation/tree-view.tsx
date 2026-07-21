"use client";

import { useObject } from "@ai-sdk/react";
import { useRouter } from "next/navigation";

import {
  generatedTreeSchema,
  type FeatureTree,
  type TreePhase,
} from "@/features/structure/domain/schema";
import type { ModelTier } from "@/shared/domain/model";
import { Button } from "@/shared/ui/button";
import { ModelTag } from "@/shared/ui/model-tag";

import { PhaseBadge } from "./phase-badge";
import { TreeEditor } from "./tree-editor";

type TreeViewProps = {
  projectId: string;
  document: { id: string; tree: FeatureTree } | null;
  modelUsed?: string | null;
  tier?: ModelTier;
};

export function TreeView({
  projectId,
  document,
  modelUsed,
  tier = "economy",
}: TreeViewProps) {
  const router = useRouter();
  const { object, submit, isLoading, error } = useObject({
    api: "/api/structure",
    schema: generatedTreeSchema,
    // The server persists the id'd tree on finish; refresh to load it for editing.
    onFinish: () => router.refresh(),
  });

  if (document) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <ModelTag model={modelUsed} />
        </div>
        <TreeEditor documentId={document.id} initialTree={document.tree} />
      </div>
    );
  }

  if (!isLoading && object === undefined) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="max-w-md text-muted">
          Turn this idea into an editable feature tree — modules and sub-features,
          each tagged by phase.
        </p>
        {error ? (
          <p className="text-sm text-error">
            Something went wrong. Check your quota or connection.
          </p>
        ) : null}
        <Button onClick={() => submit({ project_id: projectId, model: tier })}>
          Generate feature tree
        </Button>
      </div>
    );
  }

  // Streaming preview (read-only) until onFinish swaps in the editor.
  const modules = object?.modules ?? [];
  return (
    <div className="flex flex-col gap-3">
      <span className="animate-pulse font-mono text-xs uppercase tracking-[0.08em] text-accent">
        Generating…
      </span>
      <ul className="flex flex-col gap-3">
        {modules.map((module, i) => (
          <li key={i} className="rounded-md border-2 border-border bg-surface p-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">{module?.title}</span>
              {module?.phase ? <PhaseBadge phase={module.phase as TreePhase} /> : null}
            </div>
            <ul className="mt-2 flex flex-col gap-1 border-l-2 border-border pl-4 text-sm text-muted">
              {(module?.features ?? []).map((feature, j) => (
                <li key={j} className="flex items-center gap-2">
                  <span>{feature?.title}</span>
                  {feature?.phase ? (
                    <PhaseBadge phase={feature.phase as TreePhase} />
                  ) : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
