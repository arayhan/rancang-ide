import type { MarkdownDoc } from "@/features/docs/domain/schema";
import type { PrdDocument } from "@/features/prd/domain/schema";
import type { FeatureTree } from "@/features/structure/domain/schema";
import { treeToMarkdown } from "@/features/structure/domain/tree-markdown";
import type { TasksDocument } from "@/features/tasks/domain/schema";
import type { ValidationResult } from "@/features/validation/domain/schema";
import { validationToMarkdown } from "@/features/validation/domain/report-markdown";
import { buildTasksMarkdown } from "@/shared/lib/markdown";

/** Everything the founder currently has for a project — used by the "Download all"
 * master button. Cross-feature composition; lives at the app layer. */
export type BlueprintBundleInput = {
  projectTitle: string;
  ideaInput: string;
  validation?: ValidationResult | null;
  tree?: FeatureTree | null;
  prd?: PrdDocument | null;
  brd?: MarkdownDoc | null;
  databaseDesign?: MarkdownDoc | null;
  systemDesign?: MarkdownDoc | null;
  tasks?: TasksDocument | null;
};

export function buildBlueprintBundle(input: BlueprintBundleInput): string {
  const parts: string[] = [];
  parts.push(`# ${input.projectTitle}`, "");
  parts.push(`> ${input.ideaInput.trim()}`, "");

  if (input.validation) {
    parts.push("---", "", validationToMarkdown(input.validation).trim(), "");
  }
  if (input.tree) {
    parts.push("---", "", treeToMarkdown(input.tree).trim(), "");
  }
  if (input.prd) {
    parts.push("---", "", "# PRD", "", input.prd.markdown.trim(), "");
  }
  if (input.brd) {
    parts.push("---", "", `# ${input.brd.title}`, "", input.brd.markdown.trim(), "");
  }
  if (input.databaseDesign) {
    parts.push(
      "---",
      "",
      `# ${input.databaseDesign.title}`,
      "",
      input.databaseDesign.markdown.trim(),
      "",
    );
  }
  if (input.systemDesign) {
    parts.push(
      "---",
      "",
      `# ${input.systemDesign.title}`,
      "",
      input.systemDesign.markdown.trim(),
      "",
    );
  }
  if (input.tasks && input.tasks.tasks.length > 0) {
    parts.push("---", "", "# Tasks", "", buildTasksMarkdown(input.tasks.tasks), "");
  }

  return parts.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}
