import { redirect } from "next/navigation";

import { signOut } from "@/features/auth/infrastructure/auth-actions";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

/**
 * Layout for the authenticated area. Any route under (app) requires a session;
 * unauthenticated visitors are redirected to /login.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b-2 border-border px-6 py-4">
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
          Rancang Ide
        </span>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-sm border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors hover:border-primary"
          >
            Sign out
          </button>
        </form>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
