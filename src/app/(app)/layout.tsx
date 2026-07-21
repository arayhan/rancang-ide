import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionUserId } from "@/features/auth/infrastructure/session";

import { signOut } from "../auth-actions";

/**
 * Layout for the authenticated area. Any route under (app) requires a session;
 * unauthenticated visitors are redirected to /login.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-border bg-background/85 px-6 py-4 backdrop-blur-md md:px-10">
        <Link
          href="/projects"
          className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent"
        >
          Rancang<span className="text-accent"> Ide</span>
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="glow-ring rounded-sm border-2 border-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-border hover:text-foreground"
          >
            Sign out
          </button>
        </form>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
