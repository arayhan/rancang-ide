import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

/** Verified user id from the current session, or null if unauthenticated. */
export async function getSessionUserId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims?.sub ?? null;
}
