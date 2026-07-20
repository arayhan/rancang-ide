import { z } from "zod";

/** When a node is planned for. */
export const treePhaseSchema = z.enum(["mvp", "v2", "later"]);

// ── Stored / editable shape (nodes carry stable ids for editing) ──────────────

export const featureNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  phase: treePhaseSchema,
});

export const moduleNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  phase: treePhaseSchema,
  features: z.array(featureNodeSchema),
});

/** A feature tree: modules, each with sub-features. Stored as documents.content. */
export const featureTreeSchema = z.object({
  modules: z.array(moduleNodeSchema),
});

// ── AI generation contract (no ids — assigned after generation) ───────────────

export const generatedFeatureSchema = z.object({
  title: z.string().describe("A concrete sub-feature."),
  description: z.string().optional().describe("One line on what it does."),
  phase: treePhaseSchema.describe("mvp, v2, or later."),
});

export const generatedModuleSchema = z.object({
  title: z.string().describe("A top-level module / capability area."),
  phase: treePhaseSchema,
  features: z.array(generatedFeatureSchema).min(1),
});

export const generatedTreeSchema = z.object({
  modules: z.array(generatedModuleSchema).min(1),
});

export type TreePhase = z.infer<typeof treePhaseSchema>;
export type FeatureNode = z.infer<typeof featureNodeSchema>;
export type ModuleNode = z.infer<typeof moduleNodeSchema>;
export type FeatureTree = z.infer<typeof featureTreeSchema>;
export type GeneratedTree = z.infer<typeof generatedTreeSchema>;
