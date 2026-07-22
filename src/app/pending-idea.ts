/** Client-side draft storage: preserves an idea across an OAuth redirect. */
const KEY = "rancang.pending_idea";

export type PendingIdea = {
  ideaInput: string;
  targetUser?: string;
  constraints?: string;
  notes?: string;
};

export function savePendingIdea(idea: PendingIdea): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(idea));
}

export function readPendingIdea(): PendingIdea | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingIdea;
  } catch {
    return null;
  }
}

export function clearPendingIdea(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
