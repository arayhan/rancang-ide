import type {
  FeatureNode,
  FeatureTree,
  GeneratedTree,
  ModuleNode,
  TreePhase,
} from "./schema";

/**
 * Assign stable ids to a freshly generated tree so nodes can be edited.
 * Pure: takes an id generator (the caller passes crypto.randomUUID).
 */
export function assignTreeIds(
  generated: GeneratedTree,
  idGen: () => string,
): FeatureTree {
  return {
    modules: generated.modules.map((module) => ({
      id: idGen(),
      title: module.title,
      phase: module.phase,
      features: module.features.map((feature) => ({
        id: idGen(),
        title: feature.title,
        description: feature.description,
        phase: feature.phase,
      })),
    })),
  };
}

// ── Pure edit operations (immutable) ─────────────────────────────────────────

export function updateModule(
  tree: FeatureTree,
  moduleId: string,
  patch: Partial<Pick<ModuleNode, "title" | "phase">>,
): FeatureTree {
  return {
    modules: tree.modules.map((m) => (m.id === moduleId ? { ...m, ...patch } : m)),
  };
}

export function updateFeature(
  tree: FeatureTree,
  moduleId: string,
  featureId: string,
  patch: Partial<Pick<FeatureNode, "title" | "phase" | "description">>,
): FeatureTree {
  return {
    modules: tree.modules.map((m) =>
      m.id === moduleId
        ? {
            ...m,
            features: m.features.map((f) =>
              f.id === featureId ? { ...f, ...patch } : f,
            ),
          }
        : m,
    ),
  };
}

export function addFeature(
  tree: FeatureTree,
  moduleId: string,
  feature: FeatureNode,
): FeatureTree {
  return {
    modules: tree.modules.map((m) =>
      m.id === moduleId ? { ...m, features: [...m.features, feature] } : m,
    ),
  };
}

export function deleteFeature(
  tree: FeatureTree,
  moduleId: string,
  featureId: string,
): FeatureTree {
  return {
    modules: tree.modules.map((m) =>
      m.id === moduleId
        ? { ...m, features: m.features.filter((f) => f.id !== featureId) }
        : m,
    ),
  };
}

export function addModule(tree: FeatureTree, module: ModuleNode): FeatureTree {
  return { modules: [...tree.modules, module] };
}

export function deleteModule(tree: FeatureTree, moduleId: string): FeatureTree {
  return { modules: tree.modules.filter((m) => m.id !== moduleId) };
}

/** A blank feature/module with a fresh id (for the editor's "add" actions). */
export function emptyFeature(idGen: () => string, phase: TreePhase = "mvp"): FeatureNode {
  return { id: idGen(), title: "", phase };
}

export function emptyModule(idGen: () => string, phase: TreePhase = "mvp"): ModuleNode {
  return { id: idGen(), title: "", phase, features: [] };
}
