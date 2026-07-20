/**
 * Derive a short project title from the raw idea when the user didn't provide
 * one. Takes the first line, truncated to 60 chars. Pure function.
 */
export function deriveTitleFromIdea(idea: string): string {
  const firstLine = idea.trim().split("\n")[0]?.trim() ?? "";
  const base = firstLine.length > 0 ? firstLine : idea.trim();
  if (base.length <= 60) return base;
  return `${base.slice(0, 57).trimEnd()}…`;
}
