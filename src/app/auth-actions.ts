"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { MagicLinkState } from "@/features/auth/domain/types";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

/**
 * Auth server actions. These live in the composition root (src/app) because
 * they wire concrete infrastructure (the Supabase client) to the request.
 */

async function getRedirectOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/** Send a passwordless magic-link email (also signs up new users). */
export async function signInWithMagicLink(
  _prevState: MagicLinkState,
  formData: FormData,
): Promise<MagicLinkState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Please enter your email." };

  const supabase = await createSupabaseServerClient();
  const origin = await getRedirectOrigin();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/callback` },
  });

  if (error) return { error: error.message };
  return { sent: true };
}

/** Start the Google OAuth flow and redirect to the provider. */
export async function signInWithGoogle(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const origin = await getRedirectOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/callback` },
  });

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  if (data.url) redirect(data.url);
}

/** Start the GitHub OAuth flow. Needs the GitHub provider enabled in Supabase. */
export async function signInWithGithub(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const origin = await getRedirectOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${origin}/callback` },
  });

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  if (data.url) redirect(data.url);
}

/** Sign out and return to the login page. */
export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
