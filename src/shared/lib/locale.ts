"use server";

import { cookies } from "next/headers";

/** Persist the interface locale via a plain cookie (no URL restructuring). */
export async function setLocale(locale: "en" | "id"): Promise<void> {
  const store = await cookies();
  store.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
