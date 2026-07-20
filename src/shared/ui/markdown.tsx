import ReactMarkdown, { type Components } from "react-markdown";

// react-markdown builds React elements and ignores raw HTML by default, so AI
// output is rendered safely (no dangerouslySetInnerHTML, no injection).
const components: Components = {
  h1: (props) => <h1 className="mt-6 mb-3 text-2xl font-semibold" {...props} />,
  h2: (props) => <h2 className="mt-6 mb-2 text-xl font-semibold" {...props} />,
  h3: (props) => <h3 className="mt-4 mb-2 text-lg font-semibold" {...props} />,
  p: (props) => <p className="my-3 leading-relaxed" {...props} />,
  ul: (props) => <ul className="my-3 list-disc pl-6" {...props} />,
  ol: (props) => <ol className="my-3 list-decimal pl-6" {...props} />,
  li: (props) => <li className="my-1" {...props} />,
  a: (props) => <a className="text-accent underline" {...props} />,
  code: (props) => (
    <code className="rounded-sm bg-surface px-1 py-0.5 font-mono text-sm" {...props} />
  ),
  pre: (props) => (
    <pre
      className="my-3 overflow-x-auto rounded-md border-2 border-border bg-surface p-3 font-mono text-sm"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="my-3 border-l-2 border-border pl-4 text-muted" {...props} />
  ),
};

export function Markdown({ children }: { children: string }) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
}
