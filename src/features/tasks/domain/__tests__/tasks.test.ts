import { describe, expect, it } from "vitest";

import { tasksDocumentSchema, type GeneratedTasks } from "../schema";
import { assignTaskIds, toggleTask } from "../tasks";

const generated: GeneratedTasks = {
  tasks: [{ title: "Set up auth" }, { title: "Add projects CRUD" }],
};

function counter() {
  let n = 0;
  return () => `t-${n++}`;
}

describe("assignTaskIds", () => {
  it("adds ids and done:false, producing a valid tasks document", () => {
    const doc = assignTaskIds(generated, counter());
    expect(doc.tasks[0]).toMatchObject({ id: "t-0", title: "Set up auth", done: false });
    expect(() => tasksDocumentSchema.parse(doc)).not.toThrow();
  });
});

describe("toggleTask", () => {
  it("flips done immutably", () => {
    const doc = assignTaskIds(generated, counter());
    const next = toggleTask(doc, "t-0");
    expect(next.tasks[0]?.done).toBe(true);
    expect(doc.tasks[0]?.done).toBe(false);
  });
});
