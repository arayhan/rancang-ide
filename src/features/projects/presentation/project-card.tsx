import Link from "next/link";

import type { Project, ProjectStatus } from "@/features/projects/domain/project";
import { Card } from "@/shared/ui/card";

import { DeleteProjectButton } from "./delete-project-button";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  draft: "Draft",
  validated: "Validated",
  structured: "Structured",
  spec_ready: "Spec ready",
};

type ProjectCardProps = {
  project: Project;
  deleteProjectAction: (formData: FormData) => Promise<void>;
};

export function ProjectCard({ project, deleteProjectAction }: ProjectCardProps) {
  return (
    <Card className="flex items-start justify-between gap-4">
      <Link href={`/projects/${project.id}`} className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{project.ideaInput}</p>
        <span className="mt-3 inline-block font-mono text-xs uppercase tracking-[0.08em] text-accent">
          {STATUS_LABEL[project.status]}
        </span>
      </Link>
      <DeleteProjectButton id={project.id} deleteProjectAction={deleteProjectAction} />
    </Card>
  );
}
