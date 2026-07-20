/** Pure helpers to assemble export markdown from a project's artifacts. */

export type ExportTask = { title: string; done: boolean; description?: string };

export type ExportInput = {
  title: string;
  prdMarkdown: string;
  tasks?: ExportTask[];
};

/** Render tasks as a GitHub-flavored markdown checklist. */
export function buildTasksMarkdown(tasks: ExportTask[]): string {
  return tasks
    .map(
      (task) =>
        `- [${task.done ? "x" : " "}] ${task.title}${
          task.description ? ` — ${task.description}` : ""
        }`,
    )
    .join("\n");
}

/** Combine the PRD and tasks into a single markdown document. */
export function buildProjectMarkdown(input: ExportInput): string {
  const parts = [`# ${input.title}`, "", input.prdMarkdown.trim()];
  if (input.tasks && input.tasks.length > 0) {
    parts.push("", "## Tasks", "", buildTasksMarkdown(input.tasks));
  }
  return `${parts.join("\n")}\n`;
}

/** A ready-to-paste prompt for an AI coding agent (e.g. Claude Code). */
export function buildClaudeCodePrompt(input: ExportInput): string {
  return `You are an AI coding agent. Build the product specified below. Work through the tasks in order, one at a time, and follow the PRD.\n\n${buildProjectMarkdown(input)}`;
}

/** Filesystem-safe slug for a download filename. */
export function toFileSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "blueprint";
}
