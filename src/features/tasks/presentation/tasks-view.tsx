"use client";

import { useObject } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  generatedTasksSchema,
  type TasksDocument,
} from "@/features/tasks/domain/schema";
import { toggleTask } from "@/features/tasks/domain/tasks";
import { Button } from "@/shared/ui/button";
import { ModelPicker, useModelTier } from "@/shared/ui/model-picker";
import { ModelTag } from "@/shared/ui/model-tag";

type TasksViewProps = {
  projectId: string;
  document: { id: string; tasks: TasksDocument } | null;
  hasPrd: boolean;
  modelUsed?: string | null;
};

export function TasksView({ projectId, document, hasPrd, modelUsed }: TasksViewProps) {
  const [tier, setTier] = useModelTier();
  const router = useRouter();
  const { object, submit, isLoading, error } = useObject({
    api: "/api/tasks",
    schema: generatedTasksSchema,
    onFinish: () => router.refresh(),
  });

  if (document) {
    return (
      <TasksChecklist
        documentId={document.id}
        initialTasks={document.tasks}
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
          Break the PRD into a checkbox work order for your AI coding agent.
        </p>
        {!hasPrd ? (
          <p className="text-sm text-muted">Generate the PRD first.</p>
        ) : null}
        {error ? (
          <p className="text-sm text-error">
            Something went wrong. Check your quota or connection.
          </p>
        ) : null}
        <ModelPicker tier={tier} onChange={setTier} disabled={!hasPrd} />
        <Button
          onClick={() => submit({ project_id: projectId, model: tier })}
          disabled={!hasPrd}
        >
          Generate tasks
        </Button>
      </div>
    );
  }

  const tasks = object?.tasks ?? [];
  return (
    <div className="flex flex-col gap-2">
      <span className="animate-pulse font-mono text-xs uppercase tracking-[0.08em] text-accent">
        Generating…
      </span>
      <ul className="flex flex-col gap-2">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="text-muted">☐</span>
            <span>{task?.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TasksChecklist({
  documentId,
  initialTasks,
  onRegenerate,
  modelUsed,
  regenerating,
}: {
  documentId: string;
  initialTasks: TasksDocument;
  modelUsed?: string | null;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  const [tasks, setTasks] = useState<TasksDocument>(initialTasks);
  const skipSave = useRef(true);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    const timer = setTimeout(() => {
      void fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: tasks }),
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [tasks, documentId]);

  const doneCount = tasks.tasks.filter((t) => t.done).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
            {doneCount}/{tasks.tasks.length} done
          </span>
          <ModelTag model={modelUsed} />
        </div>
        <button
          onClick={onRegenerate}
          disabled={regenerating}
          className="rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors hover:border-primary disabled:opacity-60"
        >
          {regenerating ? "…" : "Regenerate"}
        </button>
      </div>

      <ul className="flex flex-col gap-1">
        {tasks.tasks.map((task) => (
          <li key={task.id}>
            <label className="flex cursor-pointer items-start gap-3 rounded-sm px-2 py-1.5 hover:bg-surface">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => setTasks((t) => toggleTask(t, task.id))}
                className="mt-1"
              />
              <span>
                <span className={task.done ? "text-muted line-through" : ""}>
                  {task.title}
                </span>
                {task.description ? (
                  <span className="block text-sm text-muted">{task.description}</span>
                ) : null}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
