import type { User } from "@supabase/supabase-js";

import { getDb } from "@/shared/infrastructure/db";

import { profiles } from "../../../../drizzle/schema";

/**
 * Upsert the profiles row for a freshly authenticated user (first login or
 * returning). Runs server-side after the session is established.
 */
export async function upsertProfileFromUser(user: User): Promise<void> {
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    null;
  const email = user.email ?? "";

  await getDb()
    .insert(profiles)
    .values({ id: user.id, email, displayName })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { email, displayName },
    });
}
