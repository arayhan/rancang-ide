/** Small label showing which AI model generated a piece of content. */
export function ModelTag({ model }: { model?: string | null }) {
  if (!model) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
      title={`Generated with ${model}`}
    >
      <span className="text-accent">◇</span> {model}
    </span>
  );
}
