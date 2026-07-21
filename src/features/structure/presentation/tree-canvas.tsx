"use client";

import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useState } from "react";

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

type NodeCallbacks = {
  onTitle: (value: string) => void;
  onPhase: (value: TreePhase) => void;
  onDelete: () => void;
  onAddFeature?: () => void;
};
type CardData = {
  title: string;
  phase: TreePhase;
  kind: "module" | "feature";
} & NodeCallbacks;

const inputCls =
  "w-full rounded-sm border border-border bg-background px-2 py-1 text-sm outline-none focus:border-primary";
const selCls =
  "rounded-sm border border-border bg-background px-1 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em]";

function CardNode({ data }: NodeProps) {
  const d = data as unknown as CardData;
  const isModule = d.kind === "module";
  return (
    <div
      className={`min-w-52 rounded-md border-2 bg-surface p-2.5 ${
        isModule ? "border-primary" : "border-border"
      }`}
    >
      {!isModule ? <Handle type="target" position={Position.Left} /> : null}
      {isModule ? <Handle type="source" position={Position.Right} /> : null}
      <div className="flex items-center gap-1.5">
        <input
          value={d.title}
          placeholder={isModule ? "Module" : "Feature"}
          onChange={(e) => d.onTitle(e.target.value)}
          className={`${inputCls} ${isModule ? "font-semibold" : ""}`}
        />
        <select
          value={d.phase}
          aria-label="Phase"
          onChange={(e) => d.onPhase(e.target.value as TreePhase)}
          className={selCls}
        >
          {PHASE_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p.toUpperCase()}
            </option>
          ))}
        </select>
        <button
          onClick={d.onDelete}
          aria-label="Delete"
          className="rounded-sm border border-border px-1.5 font-mono text-[10px] text-muted hover:border-error hover:text-error"
        >
          ✕
        </button>
      </div>
      {isModule && d.onAddFeature ? (
        <button
          onClick={d.onAddFeature}
          className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent hover:underline"
        >
          + Feature
        </button>
      ) : null}
    </div>
  );
}

const nodeTypes = { card: CardNode };

/** Controlled react-flow canvas for a feature tree. Node positions are local. */
export function TreeCanvas({
  tree,
  onChange,
}: {
  tree: FeatureTree;
  onChange: (tree: FeatureTree) => void;
}) {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    {},
  );

  const { nodes, edges } = useMemo(() => {
    const ns: Node[] = [];
    const es: Edge[] = [];
    let y = 0;
    for (const mod of tree.modules) {
      const moduleY = y;
      ns.push({
        id: mod.id,
        type: "card",
        position: positions[mod.id] ?? { x: 0, y: moduleY },
        data: {
          title: mod.title,
          phase: mod.phase,
          kind: "module",
          onTitle: (value: string) =>
            onChange(updateModule(tree, mod.id, { title: value })),
          onPhase: (value: TreePhase) =>
            onChange(updateModule(tree, mod.id, { phase: value })),
          onDelete: () => onChange(deleteModule(tree, mod.id)),
          onAddFeature: () => onChange(addFeature(tree, mod.id, emptyFeature(newId))),
        },
      });
      mod.features.forEach((feature, j) => {
        ns.push({
          id: feature.id,
          type: "card",
          position: positions[feature.id] ?? { x: 360, y: moduleY + j * 78 },
          data: {
            title: feature.title,
            phase: feature.phase,
            kind: "feature",
            onTitle: (value: string) =>
              onChange(updateFeature(tree, mod.id, feature.id, { title: value })),
            onPhase: (value: TreePhase) =>
              onChange(updateFeature(tree, mod.id, feature.id, { phase: value })),
            onDelete: () => onChange(deleteFeature(tree, mod.id, feature.id)),
          },
        });
        es.push({ id: `${mod.id}-${feature.id}`, source: mod.id, target: feature.id });
      });
      y = moduleY + Math.max(1, mod.features.length) * 78 + 56;
    }
    return { nodes: ns, edges: es };
  }, [tree, positions, onChange]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setPositions((prev) => {
      let next = prev;
      for (const c of changes) {
        if (c.type === "position" && c.position) {
          if (next === prev) next = { ...prev };
          next[c.id] = c.position;
        }
      }
      return next;
    });
  }, []);

  return (
    <div className="h-[540px] w-full rounded-md border-2 border-border bg-background-2">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
