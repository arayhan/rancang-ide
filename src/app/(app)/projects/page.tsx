import { redirect } from "next/navigation";

import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { listProjects } from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { NewProjectForm } from "@/features/projects/presentation/new-project-form";
import { ProjectCard } from "@/features/projects/presentation/project-card";

import { createProjectAction, deleteProjectAction } from "./actions";

const repo = new DrizzleProjectRepository();

export default async function ProjectsPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const projects = await listProjects(repo, userId);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 p-6">
      <section>
        <h1 className="mb-1 text-2xl font-semibold">New project</h1>
        <p className="mb-4 text-sm text-muted">
          Start with a raw idea — we validate it first, then build the blueprint.
        </p>
        <NewProjectForm createProjectAction={createProjectAction} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Your projects</h2>
        {projects.length === 0 ? (
          <p className="text-muted">
            No projects yet — create your first project above.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {projects.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} deleteProjectAction={deleteProjectAction} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
