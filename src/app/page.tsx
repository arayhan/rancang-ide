import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { IsometricBlueprint } from "@/shared/ui/isometric-blueprint";
import { LocaleSwitcher } from "@/shared/ui/locale-switcher";

const STAGES = [
  { n: "01", label: "Idea", note: "Two sentences" },
  { n: "02", label: "Validation", note: "Honest verdict" },
  { n: "03", label: "Feature tree", note: "Editable scope" },
  { n: "04", label: "PRD", note: "Ready spec" },
  { n: "05", label: "Tasks", note: "For your agent" },
];

export default async function Home() {
  const t = await getTranslations("landing");
  const tn = await getTranslations("nav");
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground">
          Rancang<span className="text-accent"> Ide</span>
        </span>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href="/login"
            className="font-mono text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
          >
            {tn("signIn")}
          </Link>
        </div>
      </header>

      {/* hero */}
      <main className="aura relative flex-1">
        <div className="bp-grid bp-grid-fade absolute inset-0 z-0 opacity-70" aria-hidden />
        <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 md:grid-cols-2 md:gap-6 md:px-10 md:py-20">
          <div className="flex flex-col items-start gap-6">
            <span
              className="reveal ticks inline-flex items-center gap-2 rounded-sm border border-border bg-surface/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent"
              style={{ animationDelay: "40ms" }}
            >
              {t("eyebrow")}
            </span>
            <h1
              className="reveal font-display text-5xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl"
              style={{ animationDelay: "120ms" }}
            >
              {t("titleA")}
              <br />
              <span className="text-accent">{t("titleB")}</span>
            </h1>
            <p
              className="reveal max-w-md text-lg leading-relaxed text-muted"
              style={{ animationDelay: "220ms" }}
            >
              {t("subtitle")}{" "}
              <span className="text-foreground">{t("dares")}</span>
            </p>
            <div
              className="reveal flex flex-wrap items-center gap-3"
              style={{ animationDelay: "320ms" }}
            >
              <Link href="/login">
                <Button className="h-12 px-7">{t("startFree")}</Button>
              </Link>
              <Link href="#pipeline">
                <Button variant="secondary" className="h-12 px-7">
                  {t("howItWorks")}
                </Button>
              </Link>
            </div>
            <p
              className="reveal font-mono text-[11px] uppercase tracking-[0.12em] text-muted"
              style={{ animationDelay: "420ms" }}
            >
              {t("freeNote")}
            </p>
          </div>

          <div className="reveal relative" style={{ animationDelay: "260ms" }}>
            <IsometricBlueprint className="h-auto w-full drop-shadow-[0_0_40px_rgba(27,68,240,0.15)]" />
          </div>
        </section>

        {/* pipeline */}
        <section
          id="pipeline"
          className="relative z-10 mx-auto max-w-6xl px-6 pb-24 md:px-10"
        >
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.16em] text-muted">
            {t("pipeline")}
          </p>
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {STAGES.map((s, i) => (
              <li
                key={s.n}
                className="ticks group relative rounded-md border-2 border-border bg-surface p-4 transition-colors hover:border-border-strong"
              >
                <span className="font-mono text-xs text-accent">{s.n}</span>
                <p className="mt-3 font-display text-lg font-medium">{s.label}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                  {s.note}
                </p>
                {i < STAGES.length - 1 ? (
                  <span
                    className="absolute -right-2 top-1/2 hidden h-px w-4 bg-border-strong lg:block"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="relative z-10 border-t-2 border-border px-6 py-6 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          {t("footer")}
        </p>
      </footer>
    </div>
  );
}
