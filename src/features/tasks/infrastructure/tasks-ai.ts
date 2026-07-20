import { streamObject, type LanguageModelUsage } from "ai";

import type { ModelTier } from "@/shared/domain/model";
import { getModel } from "@/shared/infrastructure/ai";

import { buildTasksPrompt, TASKS_SYSTEM_PROMPT } from "../domain/prompt";
import { generatedTasksSchema, type GeneratedTasks } from "../domain/schema";

export type StreamTasksParams = {
  prdMarkdown: string;
  tier: ModelTier;
};

export type TasksFinishEvent = {
  object: GeneratedTasks | undefined;
  usage: LanguageModelUsage;
  error: unknown;
};

/** Stream a task checklist from the model as a structured object. */
export function streamTasks(
  params: StreamTasksParams,
  onFinish?: (event: TasksFinishEvent) => Promise<void> | void,
) {
  return streamObject({
    model: getModel(params.tier),
    schema: generatedTasksSchema,
    system: TASKS_SYSTEM_PROMPT,
    prompt: buildTasksPrompt(params.prdMarkdown),
    onFinish,
  });
}
