import { notFound, redirect } from "next/navigation";

import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { DOC_CONFIGS } from "@/features/docs/domain/doc-config";
import { getDoc } from "@/features/docs/infrastructure/doc-repository";
import { MarkdownDocView } from "@/features/docs/presentation/markdown-doc-view";
import { getProject } from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { getPrd } from "@/features/prd/infrastructure/prd-repository";
import { ExportButtons } from "@/features/prd/presentation/export";
import { PrdView } from "@/features/prd/presentation/prd-view";
import { PrintableBlueprint } from "@/features/prd/presentation/printable-blueprint";
import { StepperShell } from "@/features/projects/presentation/project-stepper";
import type { FeatureTree } from "@/features/structure/domain/schema";
import { TreeView } from "@/features/structure/presentation/tree-view";
import { getTasks } from "@/features/tasks/infrastructure/tasks-repository";
import { TasksView } from "@/features/tasks/presentation/tasks-view";
import { getLatestValidation } from "@/features/validation/infrastructure/validation-repository";
import { ValidationView } from "@/features/validation/presentation/validation-view";
import { getDocument } from "@/shared/infrastructure/documents";

import { buildBlueprintBundle } from "./blueprint-bundle";
import { DownloadAllButton } from "./download-all-button";

const repo = new DrizzleProjectRepository();

type ProjectDetailPageProps = { params: Promise<{ id: string }> };

/** Reading-width wrapper for text-heavy stages (validation, PRD, docs, tasks). */
function ReadWidth({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6 md:py-10">
      {children}
    </div>
  );
}

/** Structure fills the viewport — canvas gets the whole width. */
function CanvasWidth({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full p-4 md:p-6">{children}</div>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const { id } = await params;
  const project = await getProject(repo, userId, id);
  if (!project) notFound();

  const latestValidation = await getLatestValidation(project.id);
  const treeDoc = await getDocument(project.id, "tree");
  const treeDocument = treeDoc
    ? { id: treeDoc.id, tree: treeDoc.content as FeatureTree, modelUsed: treeDoc.modelUsed }
    : null;
  const prdDocument = await getPrd(project.id);
  const tasksDocument = await getTasks(project.id);
  const [brdDoc, dbDoc, sysDoc] = await Promise.all([
    getDoc(project.id, "brd"),
    getDoc(project.id, "database_design"),
    getDoc(project.id, "system_design"),
  ]);
  const hasPrd = prdDocument !== null;

  const bundle = buildBlueprintBundle({
    projectTitle: project.title,
    ideaInput: project.ideaInput,
    validation: latestValidation?.report ?? null,
    tree: treeDocument?.tree ?? null,
    prd: prdDocument?.prd ?? null,
    brd: brdDoc?.doc ?? null,
    databaseDesign: dbDoc?.doc ?? null,
    systemDesign: sysDoc?.doc ?? null,
    tasks: tasksDocument?.tasks ?? null,
  });

  const completed = {
    validation: latestValidation !== null,
    structure: treeDocument !== null,
    prd: prdDocument !== null,
    brd: brdDoc !== null,
    database_design: dbDoc !== null,
    system_design: sysDoc !== null,
    tasks: tasksDocument !== null,
  };

  return (
    <>
      <StepperShell
        brandHref="/"
        brand="Rancang Ide"
        projectTitle={project.title}
        completed={completed}
        actions={
          <>
            <DownloadAllButton fileSlug={project.title} content={bundle} />
            <ExportButtons
              title={prdDocument?.prd.title || project.title}
              prdMarkdown={prdDocument?.prd.markdown ?? null}
              tasks={tasksDocument?.tasks.tasks}
            />
          </>
        }
        slots={{
          validation: (
            <ReadWidth>
              <ValidationView
                projectId={project.id}
                initialResult={latestValidation?.report ?? null}
                modelUsed={latestValidation?.modelUsed}
              />
            </ReadWidth>
          ),
          structure: (
            <CanvasWidth>
              <TreeView
                projectId={project.id}
                document={treeDocument}
                modelUsed={treeDocument?.modelUsed}
              />
            </CanvasWidth>
          ),
          prd: (
            <ReadWidth>
              <PrdView
                projectId={project.id}
                document={prdDocument}
                hasTree={treeDocument !== null}
                modelUsed={prdDocument?.modelUsed}
              />
            </ReadWidth>
          ),
          brd: (
            <ReadWidth>
              <MarkdownDocView
                projectId={project.id}
                type="brd"
                fileSlug="brd"
                blurb={DOC_CONFIGS.brd.blurb}
                available
                document={brdDoc}
              />
            </ReadWidth>
          ),
          database_design: (
            <ReadWidth>
              <MarkdownDocView
                projectId={project.id}
                type="database_design"
                fileSlug="database-design"
                blurb={DOC_CONFIGS.database_design.blurb}
                prerequisiteHint="Generate the PRD first."
                available={hasPrd}
                document={dbDoc}
              />
            </ReadWidth>
          ),
          system_design: (
            <ReadWidth>
              <MarkdownDocView
                projectId={project.id}
                type="system_design"
                fileSlug="system-design"
                blurb={DOC_CONFIGS.system_design.blurb}
                prerequisiteHint="Generate the PRD first."
                available={hasPrd}
                document={sysDoc}
              />
            </ReadWidth>
          ),
          tasks: (
            <ReadWidth>
              <TasksView
                projectId={project.id}
                document={tasksDocument}
                hasPrd={prdDocument !== null}
                modelUsed={tasksDocument?.modelUsed}
              />
            </ReadWidth>
          ),
        }}
      />
      {prdDocument ? (
        <PrintableBlueprint
          title={prdDocument.prd.title || project.title}
          prdMarkdown={prdDocument.prd.markdown}
          tasks={tasksDocument?.tasks.tasks}
        />
      ) : null}
    </>
  );
}
