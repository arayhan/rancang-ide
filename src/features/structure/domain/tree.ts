import type { FeatureTree, GeneratedTree } from "./schema";

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
