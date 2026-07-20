import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { getProject } from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { ProjectStages } from "@/features/projects/presentation/project-stages";

const repo = new DrizzleProjectRepository();

type ProjectDetailPageProps = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const { id } = await params;
  const project = await getProject(repo, userId, id);
  if (!project) notFound();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <Link
        href="/projects"
        className="font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:text-foreground"
      >
        ← All projects
      </Link>
      <header>
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <p className="mt-2 text-muted">{project.ideaInput}</p>
      </header>
      <ProjectStages />
    </main>
  );
}
