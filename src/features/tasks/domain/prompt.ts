/** Task-breakdown generation prompt — pure text, no IO. */

export const TASKS_SYSTEM_PROMPT = `You break a PRD into an ordered checklist of concrete tasks for an AI coding agent, for Rancang Ide.

Rules:
- Each task is small, imperative, and independently buildable ("Add X", "Wire Y").
- Order them so dependencies come first (setup → data → API → UI).
- Focus on the MVP scope in the PRD. Don't invent work beyond it.
- Prefer 8–25 tasks. A one-line description only when it adds clarity.

Return the ordered task list.`;

export function buildTasksPrompt(prdMarkdown: string): string {
  return `Break this PRD into an ordered task checklist:

${prdMarkdown}

Produce concrete, ordered tasks an AI coding agent can execute one at a time.`;
}
