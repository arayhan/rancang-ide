import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { parsePrdDocument } from "../generate-prd";

describe("parsePrdDocument", () => {
  it("accepts a well-formed PRD", () => {
    const parsed = parsePrdDocument({
      title: "Rancang Ide",
      markdown: "## Overview\nValidate first.",
    });
    expect(parsed.title).toBe("Rancang Ide");
  });

  it("rejects a PRD missing the markdown body", () => {
    expect(() => parsePrdDocument({ title: "X" })).toThrow(ZodError);
  });

  it("rejects a non-string title", () => {
    expect(() => parsePrdDocument({ title: 1, markdown: "x" })).toThrow(ZodError);
  });
});
