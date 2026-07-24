import type { ComponentPropsWithoutRef } from "react";

/**
 * Design-system table primitives.
 *
 * AI output (risk matrices, requirement tables, schema definitions) arrives as
 * GFM pipe tables and renders through these. Cells hold prose rather than short
 * values, so they align to the top and wrap; the whole table scrolls sideways
 * on narrow screens instead of squeezing columns to unreadable widths.
 */

export function DataTable({ className = "", ...props }: ComponentPropsWithoutRef<"table">) {
  return (
    // print:overflow-visible — a scroll container would clip columns on paper.
    <div className="my-4 overflow-x-auto rounded-md border border-border print:overflow-visible">
      <table
        className={`w-full min-w-[36rem] border-collapse text-left text-sm print:min-w-0 print:text-xs ${className}`}
        {...props}
      />
    </div>
  );
}

export function DataTableHead(props: ComponentPropsWithoutRef<"thead">) {
  return <thead className="bg-background-2" {...props} />;
}

export function DataTableBody(props: ComponentPropsWithoutRef<"tbody">) {
  return <tbody {...props} />;
}

export function DataTableRow(props: ComponentPropsWithoutRef<"tr">) {
  return <tr className="transition-colors hover:bg-background-2/60" {...props} />;
}

export function DataTableHeaderCell({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className={`border-b-2 border-border px-4 py-3 text-left align-bottom font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted ${className}`}
      {...props}
    />
  );
}

export function DataTableCell({ className = "", ...props }: ComponentPropsWithoutRef<"td">) {
  // border-collapse merges this against the header's heavier rule, so the
  // first body row gets one clean line rather than a doubled one.
  return (
    <td
      className={`border-t border-border px-4 py-3 align-top leading-relaxed ${className}`}
      {...props}
    />
  );
}
