import { NextResponse, type NextRequest } from "next/server";

import { upsertProfileFromUser } from "@/features/auth/infrastructure/profile";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

/**
 * OAuth / magic-link return URL. Exchanges the code for a session, upserts the
 * user's profile row, then redirects into the app.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/projects";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        try {
          await upsertProfileFromUser(user);
        } catch {
          // Best-effort: the session is valid even if the profile write fails.
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const redirectBase = forwardedHost ? `https://${forwardedHost}` : origin;
      return NextResponse.redirect(`${redirectBase}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
