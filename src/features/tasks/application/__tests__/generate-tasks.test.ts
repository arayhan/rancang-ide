import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { parseGeneratedTasks } from "../generate-tasks";

describe("parseGeneratedTasks", () => {
  it("accepts a non-empty task list", () => {
    const parsed = parseGeneratedTasks({
      tasks: [{ title: "Set up auth" }, { title: "Add projects CRUD" }],
    });
    expect(parsed.tasks).toHaveLength(2);
  });

  it("rejects an empty task list", () => {
    expect(() => parseGeneratedTasks({ tasks: [] })).toThrow(ZodError);
  });

  it("rejects a task without a title", () => {
    expect(() => parseGeneratedTasks({ tasks: [{ description: "x" }] })).toThrow(
      ZodError,
    );
  });
});
