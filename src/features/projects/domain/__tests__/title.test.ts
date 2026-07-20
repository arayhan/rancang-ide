import { describe, expect, it } from "vitest";

import { deriveTitleFromIdea } from "../title";

describe("deriveTitleFromIdea", () => {
  it("uses the first line as-is when short", () => {
    expect(deriveTitleFromIdea("A note-taking app for devs")).toBe(
      "A note-taking app for devs",
    );
  });

  it("takes only the first line", () => {
    expect(deriveTitleFromIdea("My idea\nmore details below")).toBe("My idea");
  });

  it("truncates long ideas to 60 chars with an ellipsis", () => {
    const long = "a".repeat(80);
    const title = deriveTitleFromIdea(long);
    expect(title.endsWith("…")).toBe(true);
    expect(title.length).toBeLessThanOrEqual(60);
  });
});
