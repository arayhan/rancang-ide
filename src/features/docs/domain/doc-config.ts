/** Extra generated document types (beyond validation/tree/prd/tasks). */
export type DocType = "brd" | "database_design" | "system_design";

export function isDocType(value: string): value is DocType {
  return (
    value === "brd" || value === "database_design" || value === "system_design"
  );
}

/** Context the generators can draw on (filled by the route from prior stages). */
export type DocSources = {
  idea: string;
  context: Record<string, unknown> | null;
  validationSummary?: string;
  treeJson?: string;
  prdMarkdown?: string;
};

export type DocConfig = {
  type: DocType;
  label: string;
  blurb: string;
  /** Prerequisite stage: "prd" means a PRD must exist first. */
  requires: "none" | "prd";
  systemPrompt: string;
  buildPrompt: (sources: DocSources) => string;
};

function ideaBlock(s: DocSources): string {
  const ctx =
    s.context && Object.keys(s.context).length > 0
      ? `\n\nContext:\n${JSON.stringify(s.context, null, 2)}`
      : "";
  const val = s.validationSummary ? `\n\nValidation findings:\n${s.validationSummary}` : "";
  return `Idea:\n"""\n${s.idea}\n"""${ctx}${val}`;
}

export const DOC_CONFIGS: Record<DocType, DocConfig> = {
  brd: {
    type: "brd",
    label: "BRD",
    blurb: "A business requirements document — objectives, scope, requirements, risks.",
    requires: "none",
    systemPrompt: `You write a concise Business Requirements Document (BRD) for a product, for Rancang Ide.
Use GitHub-flavored markdown with these sections:
- ## Executive summary
- ## Business objectives & success metrics
- ## Stakeholders
- ## Scope (in scope / out of scope)
- ## Functional requirements (numbered)
- ## Non-functional requirements
- ## Assumptions & constraints
- ## Risks & mitigations
Be specific and grounded in the idea. No fluff. Return the title and the markdown body.`,
    buildPrompt: (s) =>
      `Write the BRD for this product.\n\n${ideaBlock(s)}${
        s.treeJson ? `\n\nFeature tree (JSON):\n${s.treeJson}` : ""
      }`,
  },
  database_design: {
    type: "database_design",
    label: "Database design",
    blurb: "Tables, columns, relationships and indexes derived from the PRD.",
    requires: "prd",
    systemPrompt: `You design the database schema for a product, given its PRD, for Rancang Ide.
Use GitHub-flavored markdown:
- ## Overview (datastore choice + rationale)
- ## Entities — one "### <table>" per table with a markdown table of columns (name, type, constraints) and notes on primary/foreign keys
- ## Relationships
- ## Indexes
- ## Access control (RLS / multi-tenancy) if user data is involved
- Include a Mermaid ER diagram in a \`\`\`mermaid erDiagram\`\`\` block.
Be implementation-ready. Return the title and the markdown body.`,
    buildPrompt: (s) =>
      `Design the database from this PRD.\n\nPRD:\n${s.prdMarkdown ?? ""}${
        s.treeJson ? `\n\nFeature tree (JSON):\n${s.treeJson}` : ""
      }`,
  },
  system_design: {
    type: "system_design",
    label: "System design",
    blurb: "Architecture, components, data flow and APIs derived from the PRD.",
    requires: "prd",
    systemPrompt: `You produce a system/architecture design for a product, given its PRD, for Rancang Ide.
Use GitHub-flavored markdown:
- ## Architecture overview
- ## Components & responsibilities
- ## Data flow
- ## APIs / integrations (key endpoints)
- ## Tech choices & rationale
- ## Scalability, reliability & security considerations
- Include a Mermaid diagram in a \`\`\`mermaid\`\`\` block (flowchart or C4-style).
Be concrete and buildable by an AI coding agent. Return the title and the markdown body.`,
    buildPrompt: (s) =>
      `Design the system from this PRD.\n\nPRD:\n${s.prdMarkdown ?? ""}${
        s.treeJson ? `\n\nFeature tree (JSON):\n${s.treeJson}` : ""
      }`,
  },
};
