import { type NextRequest } from "next/server";

import { updateSession } from "@/shared/infrastructure/supabase/middleware";

// Next 16's "proxy" convention (formerly "middleware"). Refreshes the Supabase
// session on every matched request.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Run on all paths except static assets and image files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
