"use client";

type DeleteProjectButtonProps = {
  id: string;
  deleteProjectAction: (formData: FormData) => Promise<void>;
};

export function DeleteProjectButton({
  id,
  deleteProjectAction,
}: DeleteProjectButtonProps) {
  return (
    <form
      action={deleteProjectAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this project? This can't be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Delete project"
        className="glow-ring rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:border-error hover:text-error"
      >
        Delete
      </button>
    </form>
  );
}
