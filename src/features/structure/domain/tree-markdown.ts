import type { FeatureTree } from "./schema";

/** Serialize a feature tree to a markdown outline (for per-stage download). Pure. */
export function treeToMarkdown(tree: FeatureTree): string {
  const lines: string[] = ["# Feature tree", ""];
  for (const mod of tree.modules) {
    lines.push(`## ${mod.title} _(${mod.phase})_`);
    for (const feature of mod.features) {
      const desc = feature.description ? ` — ${feature.description}` : "";
      lines.push(`- **${feature.title}** _(${feature.phase})_${desc}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}
