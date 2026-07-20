import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { getProject } from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { getPrd } from "@/features/prd/infrastructure/prd-repository";
import { ExportButtons } from "@/features/prd/presentation/export";
import { PrdView } from "@/features/prd/presentation/prd-view";
import { ProjectStages } from "@/features/projects/presentation/project-stages";
import type { FeatureTree } from "@/features/structure/domain/schema";
import { TreeView } from "@/features/structure/presentation/tree-view";
import { getTasks } from "@/features/tasks/infrastructure/tasks-repository";
import { TasksView } from "@/features/tasks/presentation/tasks-view";
import { getLatestValidation } from "@/features/validation/infrastructure/validation-repository";
import { ValidationView } from "@/features/validation/presentation/validation-view";
import { getDocument } from "@/shared/infrastructure/documents";

const repo = new DrizzleProjectRepository();

type ProjectDetailPageProps = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const { id } = await params;
  const project = await getProject(repo, userId, id);
  if (!project) notFound();

  const latestValidation = await getLatestValidation(project.id);
  const treeDoc = await getDocument(project.id, "tree");
  const treeDocument = treeDoc
    ? { id: treeDoc.id, tree: treeDoc.content as FeatureTree }
    : null;
  const prdDocument = await getPrd(project.id);
  const tasksDocument = await getTasks(project.id);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <Link
        href="/projects"
        className="font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:text-foreground"
      >
        ← All projects
      </Link>
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <p className="mt-2 text-muted">{project.ideaInput}</p>
        </div>
        {prdDocument ? (
          <ExportButtons
            title={prdDocument.prd.title || project.title}
            prdMarkdown={prdDocument.prd.markdown}
            tasks={tasksDocument?.tasks.tasks}
          />
        ) : null}
      </header>
      <ProjectStages
        slots={{
          validation: (
            <ValidationView projectId={project.id} initialResult={latestValidation} />
          ),
          structure: <TreeView projectId={project.id} document={treeDocument} />,
          prd: (
            <PrdView
              projectId={project.id}
              document={prdDocument}
              hasTree={treeDocument !== null}
            />
          ),
          tasks: (
            <TasksView
              projectId={project.id}
              document={tasksDocument}
              hasPrd={prdDocument !== null}
            />
          ),
        }}
      />
    </main>
  );
}
