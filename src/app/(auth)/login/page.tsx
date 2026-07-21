import Link from "next/link";

import { LoginForm } from "@/features/auth/presentation/login-form";

import { signInWithGoogle, signInWithMagicLink } from "../../auth-actions";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="bp-grid bp-grid-fade absolute inset-0 z-0 opacity-60" aria-hidden />
      <header className="relative z-10 px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground"
        >
          Rancang<span className="text-accent"> Ide</span>
        </Link>
      </header>

      <main className="aura relative z-10 flex flex-1 items-center justify-center px-6 py-10">
        <div className="ticks glow w-full max-w-md rounded-lg border-2 border-border bg-surface/80 p-8 backdrop-blur-sm">
          <div className="reveal mb-8 flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
              Sign in
            </span>
            <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
            <p className="text-sm text-muted">
              Validate first, then build. Sign in to turn ideas into blueprints.
            </p>
          </div>
          <div className="reveal" style={{ animationDelay: "120ms" }}>
            <LoginForm
              signInWithMagicLink={signInWithMagicLink}
              signInWithGoogle={signInWithGoogle}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
