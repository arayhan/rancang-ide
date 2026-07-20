/** PRD generation prompt — pure text, no IO. */

export const PRD_SYSTEM_PROMPT = `You write a concise, buildable PRD for a product, given its idea and curated feature tree, for Rancang Ide.

The PRD is GitHub-flavored markdown and should include:
- ## Overview — what it is and the problem it solves
- ## Goals & non-goals — a short bulleted list of each
- ## Features — for each MVP module/feature: what it does + acceptance criteria (bullet "AC:")
- Keep it tight and implementation-ready for an AI coding agent. No fluff, no marketing.

Respect the phase tags: describe MVP features in detail; mention v2/later only briefly under a "## Later" heading.
Return the title, an optional one-paragraph summary, and the markdown body.`;

export function buildPrdPrompt(idea: string, treeJson: string): string {
  return `Write the PRD for this product.

Idea:
"""
${idea}
"""

Curated feature tree (JSON):
${treeJson}

Produce the PRD markdown grounded in this tree — do not invent features outside it.`;
}
