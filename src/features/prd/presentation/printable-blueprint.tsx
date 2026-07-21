import { buildProjectMarkdown, type ExportTask } from "@/shared/lib/markdown";
import { Markdown } from "@/shared/ui/markdown";

/**
 * Hidden on screen; revealed only for printing (see the print rules in
 * globals.css). Renders the full blueprint so "PDF" prints a clean document.
 */
export function PrintableBlueprint({
  title,
  prdMarkdown,
  tasks,
}: {
  title: string;
  prdMarkdown: string;
  tasks?: ExportTask[];
}) {
  const md = buildProjectMarkdown({ title, prdMarkdown, tasks });
  return (
    <div className="print-doc" aria-hidden>
      <Markdown>{md}</Markdown>
    </div>
  );
}
