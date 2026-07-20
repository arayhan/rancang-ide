import { describe, expect, it } from "vitest";

import {
  featureTreeSchema,
  type FeatureTree,
  type GeneratedTree,
} from "../schema";
import {
  addFeature,
  addModule,
  assignTreeIds,
  deleteFeature,
  deleteModule,
  emptyFeature,
  emptyModule,
  updateFeature,
  updateModule,
} from "../tree";

function counter() {
  let n = 0;
  return () => `id-${n++}`;
}

const generated: GeneratedTree = {
  modules: [
    {
      title: "Auth",
      phase: "mvp",
      features: [{ title: "Login", phase: "mvp" }],
    },
  ],
};

const tree: FeatureTree = {
  modules: [
    {
      id: "m1",
      title: "Auth",
      phase: "mvp",
      features: [{ id: "f1", title: "Login", phase: "mvp" }],
    },
  ],
};

describe("assignTreeIds", () => {
  it("assigns ids and produces a schema-valid tree", () => {
    const result = assignTreeIds(generated, counter());
    expect(result.modules[0]?.id).toBe("id-0");
    expect(result.modules[0]?.features[0]?.id).toBe("id-1");
    expect(result.modules[0]?.title).toBe("Auth");
    expect(() => featureTreeSchema.parse(result)).not.toThrow();
  });
});

describe("edit ops", () => {
  it("updateModule changes title without mutating the original", () => {
    const next = updateModule(tree, "m1", { title: "Accounts" });
    expect(next.modules[0]?.title).toBe("Accounts");
    expect(tree.modules[0]?.title).toBe("Auth");
  });

  it("updateFeature changes a feature's phase", () => {
    const next = updateFeature(tree, "m1", "f1", { phase: "v2" });
    expect(next.modules[0]?.features[0]?.phase).toBe("v2");
  });

  it("addFeature and deleteFeature", () => {
    const added = addFeature(tree, "m1", emptyFeature(() => "f2"));
    expect(added.modules[0]?.features).toHaveLength(2);
    const removed = deleteFeature(added, "m1", "f1");
    expect(removed.modules[0]?.features).toHaveLength(1);
    expect(removed.modules[0]?.features[0]?.id).toBe("f2");
  });

  it("addModule and deleteModule", () => {
    const added = addModule(tree, emptyModule(() => "m2"));
    expect(added.modules).toHaveLength(2);
    expect(deleteModule(added, "m1").modules).toHaveLength(1);
  });

  it("keeps the tree schema-valid after edits", () => {
    let t = addModule(tree, emptyModule(() => "m2"));
    t = addFeature(t, "m2", { id: "f9", title: "Something", phase: "later" });
    t = updateModule(t, "m2", { title: "Billing" });
    expect(() => featureTreeSchema.parse(t)).not.toThrow();
  });
});
