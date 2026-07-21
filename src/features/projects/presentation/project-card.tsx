import Link from "next/link";

import type { Project, ProjectStatus } from "@/features/projects/domain/project";
import { Card } from "@/shared/ui/card";

import { DeleteProjectButton } from "./delete-project-button";

const STATUS: Record<ProjectStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "border-border text-muted" },
  validated: { label: "Validated", className: "border-success/50 text-success" },
  structured: { label: "Structured", className: "border-accent/50 text-accent" },
  spec_ready: { label: "Spec ready", className: "border-primary text-accent" },
};

type ProjectCardProps = {
  project: Project;
  deleteProjectAction: (formData: FormData) => Promise<void>;
};

export function ProjectCard({ project, deleteProjectAction }: ProjectCardProps) {
  const status = STATUS[project.status];
  return (
    <Card interactive className="flex items-start justify-between gap-4">
      <Link href={`/projects/${project.id}`} className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <h3 className="truncate font-display font-semibold">{project.title}</h3>
          <span
            className={`shrink-0 rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${status.className}`}
          >
            {status.label}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{project.ideaInput}</p>
      </Link>
      <DeleteProjectButton id={project.id} deleteProjectAction={deleteProjectAction} />
    </Card>
  );
}
