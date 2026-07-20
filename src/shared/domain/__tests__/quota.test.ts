import { describe, expect, it } from "vitest";

import { FREE_PROJECT_LIMIT, isOverProjectQuota } from "../quota";

describe("isOverProjectQuota", () => {
  it("allows a free user at the limit", () => {
    expect(isOverProjectQuota("free", FREE_PROJECT_LIMIT)).toBe(false);
  });

  it("blocks a free user over the limit", () => {
    expect(isOverProjectQuota("free", FREE_PROJECT_LIMIT + 1)).toBe(true);
  });

  it("allows a free user under the limit", () => {
    expect(isOverProjectQuota("free", 0)).toBe(false);
  });

  it("never blocks a pro user", () => {
    expect(isOverProjectQuota("pro", 999)).toBe(false);
  });
});
