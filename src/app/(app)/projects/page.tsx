import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { getUserPlan } from "@/features/auth/infrastructure/profile";
import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { listProjects } from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { NewProjectForm } from "@/features/projects/presentation/new-project-form";
import { Paywall } from "@/features/projects/presentation/paywall";
import { ProjectCard } from "@/features/projects/presentation/project-card";
import { isAtProjectLimit } from "@/shared/domain/quota";
import { Card } from "@/shared/ui/card";

import { createProjectAction, deleteProjectAction } from "./actions";

const repo = new DrizzleProjectRepository();

export default async function ProjectsPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const [projects, plan] = await Promise.all([
    listProjects(repo, userId),
    getUserPlan(userId),
  ]);
  const atLimit = isAtProjectLimit(plan, projects.length);
  const t = await getTranslations("dashboard");

  return (
    <main className="relative">
      <div
        className="bp-grid bp-grid-fade pointer-events-none absolute inset-x-0 top-0 z-0 h-80 opacity-50"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-12 px-6 py-10 md:py-14">
        <section className="reveal flex flex-col gap-5">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
              {t("newProject")}
            </span>
            <h1 className="mt-2 font-display text-3xl font-semibold">
              {t("newHeading")}
            </h1>
            <p className="mt-2 text-sm text-muted">{t("newSub")}</p>
          </div>
          {atLimit ? (
            <Paywall />
          ) : (
            <Card ticks className="glow">
              <NewProjectForm createProjectAction={createProjectAction} />
            </Card>
          )}
        </section>

        <section className="reveal" style={{ animationDelay: "120ms" }}>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold">{t("yourProjects")}</h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              {t("total", { count: projects.length })}
            </span>
          </div>
          {projects.length === 0 ? (
            <div className="ticks flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-border bg-surface/40 py-14 text-center">
              <p className="font-medium">{t("emptyTitle")}</p>
              <p className="max-w-xs text-sm text-muted">{t("emptyBody")}</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {projects.map((project) => (
                <li key={project.id}>
                  <ProjectCard
                    project={project}
                    deleteProjectAction={deleteProjectAction}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
