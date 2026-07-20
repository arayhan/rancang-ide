import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { parseGeneratedTree } from "../generate-tree";

const valid = {
  modules: [
    {
      title: "Validation",
      phase: "mvp",
      features: [{ title: "Streaming report", phase: "mvp" }],
    },
  ],
};

describe("parseGeneratedTree", () => {
  it("accepts a well-formed tree", () => {
    const parsed = parseGeneratedTree(valid);
    expect(parsed.modules).toHaveLength(1);
    expect(parsed.modules[0]?.features[0]?.title).toBe("Streaming report");
  });

  it("rejects an empty module list", () => {
    expect(() => parseGeneratedTree({ modules: [] })).toThrow(ZodError);
  });

  it("rejects a module with no features", () => {
    expect(() =>
      parseGeneratedTree({ modules: [{ title: "X", phase: "mvp", features: [] }] }),
    ).toThrow(ZodError);
  });

  it("rejects an unknown phase", () => {
    expect(() =>
      parseGeneratedTree({
        modules: [{ title: "X", phase: "someday", features: [{ title: "Y", phase: "mvp" }] }],
      }),
    ).toThrow(ZodError);
  });
});
