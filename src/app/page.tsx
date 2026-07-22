import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { ChatEntry } from "./chat-entry";
import { listProjects } from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { ProjectCard } from "@/features/projects/presentation/project-card";
import { LocaleSwitcher } from "@/shared/ui/locale-switcher";

import {
  signInWithGithub,
  signInWithGoogle,
  signInWithMagicLink,
  signOut,
} from "./auth-actions";
import { createProjectAction, deleteProjectAction } from "./projects/actions";

const repo = new DrizzleProjectRepository();

/**
 * The chat-first entry point. Replaces the marketing landing: typing an idea
 * is the primary CTA. If not signed in, submitting opens the login modal
 * (idea is preserved through the OAuth redirect via localStorage).
 */
export default async function Home() {
  const [t, tn, td] = await Promise.all([
    getTranslations("chat"),
    getTranslations("nav"),
    getTranslations("dashboard"),
  ]);
  const userId = await getSessionUserId();
  const authed = userId !== null;
  const projects = authed ? await listProjects(repo, userId!) : [];

  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        className="bp-grid bp-grid-fade pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] opacity-60"
        aria-hidden
      />
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent"
        >
          Rancang<span className="text-accent"> Ide</span>
        </Link>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          {authed ? (
            <form action={signOut}>
              <button
                type="submit"
                className="glow-ring rounded-sm border-2 border-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-border hover:text-foreground"
              >
                {tn("signOut")}
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="font-mono text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
            >
              {tn("signIn")}
            </Link>
          )}
        </div>
      </header>

      <main className="aura relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-14 px-6 pb-16 pt-8 md:px-10 md:pt-14">
        <section className="reveal flex flex-col gap-6">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent"
            style={{ animationDelay: "40ms" }}
          >
            {t("eyebrow")}
          </span>
          <h1
            className="reveal font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            style={{ animationDelay: "120ms" }}
          >
            {t("greeting")}
          </h1>
          <p
            className="reveal max-w-xl text-muted"
            style={{ animationDelay: "200ms" }}
          >
            {t("subtitle")}
          </p>
          <div className="reveal" style={{ animationDelay: "280ms" }}>
            <ChatEntry
              authed={authed}
              createProjectAction={createProjectAction}
              signInWithMagicLink={signInWithMagicLink}
              signInWithGoogle={signInWithGoogle}
              signInWithGithub={signInWithGithub}
            />
          </div>
        </section>

        {authed ? (
          <section className="reveal" style={{ animationDelay: "360ms" }}>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-lg font-semibold">
                {t("yourProjects")}
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                {td("total", { count: projects.length })}
              </span>
            </div>
            {projects.length === 0 ? (
              <div className="ticks rounded-md border-2 border-dashed border-border bg-surface/40 px-6 py-10 text-center">
                <p className="text-sm text-muted">{t("empty")}</p>
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
        ) : null}
      </main>
    </div>
  );
}
