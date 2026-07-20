import { describe, expect, it } from "vitest";

import {
  buildClaudeCodePrompt,
  buildProjectMarkdown,
  buildTasksMarkdown,
  toFileSlug,
} from "../markdown";

const tasks = [
  { title: "Set up auth", done: true },
  { title: "Add CRUD", done: false, description: "projects" },
];

describe("buildTasksMarkdown", () => {
  it("renders GFM checkboxes with state", () => {
    const md = buildTasksMarkdown(tasks);
    expect(md).toContain("- [x] Set up auth");
    expect(md).toContain("- [ ] Add CRUD — projects");
  });
});

describe("buildProjectMarkdown", () => {
  it("includes the title, PRD body and a tasks section", () => {
    const md = buildProjectMarkdown({
      title: "Rancang Ide",
      prdMarkdown: "## Overview\nValidate first.",
      tasks,
    });
    expect(md.startsWith("# Rancang Ide")).toBe(true);
    expect(md).toContain("## Overview");
    expect(md).toContain("## Tasks");
    expect(md).toContain("- [x] Set up auth");
  });

  it("omits the tasks section when there are none", () => {
    const md = buildProjectMarkdown({ title: "X", prdMarkdown: "body" });
    expect(md).not.toContain("## Tasks");
  });
});

describe("buildClaudeCodePrompt", () => {
  it("wraps the blueprint with agent instructions", () => {
    const prompt = buildClaudeCodePrompt({ title: "X", prdMarkdown: "body", tasks });
    expect(prompt).toContain("AI coding agent");
    expect(prompt).toContain("# X");
    expect(prompt).toContain("- [x] Set up auth");
  });
});

describe("toFileSlug", () => {
  it("slugifies a title", () => {
    expect(toFileSlug("Rancang Ide!")).toBe("rancang-ide");
  });

  it("falls back when empty", () => {
    expect(toFileSlug("!!!")).toBe("blueprint");
  });
});
