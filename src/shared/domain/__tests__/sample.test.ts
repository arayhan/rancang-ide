import { describe, expect, it } from "vitest";

// Smoke test: proves the vitest pipeline runs. Replaced by real domain tests
// as features land (Phase 1+).
describe("test pipeline", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
