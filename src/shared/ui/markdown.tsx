import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "./data-table";

// react-markdown builds React elements and ignores raw HTML by default, so AI
// output is rendered safely (no dangerouslySetInnerHTML, no injection).
//
// remark-gfm adds the GitHub-flavored syntax the models actually emit — pipe
// tables, `- [x]` task lists, strikethrough, bare autolinks. Without it those
// fall back to CommonMark and leak through as literal pipes and brackets.
const components: Components = {
  h1: (props) => <h1 className="mt-6 mb-3 text-2xl font-semibold" {...props} />,
  h2: (props) => <h2 className="mt-6 mb-2 text-xl font-semibold" {...props} />,
  h3: (props) => <h3 className="mt-4 mb-2 text-lg font-semibold" {...props} />,
  p: (props) => <p className="my-3 leading-relaxed" {...props} />,
  ul: (props) => <ul className="my-3 list-disc pl-6" {...props} />,
  ol: (props) => <ol className="my-3 list-decimal pl-6" {...props} />,
  li: ({ className, ...props }) =>
    // GFM marks checklist items; drop the bullet so the checkbox reads as the marker.
    className?.includes("task-list-item") ? (
      <li className="my-1 -ml-4 flex list-none items-baseline gap-2" {...props} />
    ) : (
      <li className="my-1" {...props} />
    ),
  input: ({ type, checked, ...props }) =>
    type === "checkbox" ? (
      <input
        type="checkbox"
        checked={checked}
        readOnly
        disabled
        className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-primary"
        {...props}
      />
    ) : (
      <input type={type} {...props} />
    ),
  del: (props) => <del className="text-muted line-through" {...props} />,
  a: (props) => <a className="text-accent underline" {...props} />,
  code: (props) => (
    <code
      className="rounded-sm bg-background-2 px-1 py-0.5 font-mono text-sm text-primary"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-3 overflow-x-auto rounded-md border border-border bg-background-2 p-3 font-mono text-sm"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="my-3 border-l-2 border-border pl-4 text-muted" {...props} />
  ),
  table: (props) => <DataTable {...props} />,
  thead: (props) => <DataTableHead {...props} />,
  tbody: (props) => <DataTableBody {...props} />,
  tr: (props) => <DataTableRow {...props} />,
  th: (props) => <DataTableHeaderCell {...props} />,
  td: (props) => <DataTableCell {...props} />,
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
