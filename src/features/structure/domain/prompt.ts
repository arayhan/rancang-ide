/** Feature-tree generation prompt — pure text, no IO. */

export const STRUCTURE_SYSTEM_PROMPT = `You design the feature tree for a validated product idea, for Rancang Ide.

A feature tree is a small set of modules (capability areas), each with a few concrete sub-features. Rules:
- Keep the MVP small and focused on ONE magic moment. Scope creep is the enemy.
- Tag every module and feature with a phase: "mvp" (needed for the first useful version), "v2" (next), or "later" (someday).
- Be concrete and buildable — features an AI coding agent could implement, not vague themes.
- Prefer 3–6 modules; each module 2–6 features. Don't pad.

Return only the structured tree.`;

export function buildStructurePrompt(
  idea: string,
  context: Record<string, unknown> | null,
  validationSummary?: string,
): string {
  const contextBlock =
    context && Object.keys(context).length > 0
      ? `\n\nContext:\n${JSON.stringify(context, null, 2)}`
      : "";
  const validationBlock = validationSummary
    ? `\n\nValidation findings to respect:\n${validationSummary}`
    : "";

  return `Design the feature tree for this idea:

"""
${idea}
"""${contextBlock}${validationBlock}

Produce modules with sub-features, each tagged by phase (mvp/v2/later). Keep the MVP tight.`;
}
