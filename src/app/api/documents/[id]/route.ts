import { NextResponse, type NextRequest } from "next/server";

import { getSessionUserId } from "@/features/auth/infrastructure/session";
import { updateDocumentContent } from "@/shared/infrastructure/documents";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    content?: unknown;
  } | null;
  if (!body || typeof body.content !== "object" || body.content === null) {
    return NextResponse.json({ error: "content_required" }, { status: 400 });
  }

  const updated = await updateDocumentContent(id, userId, body.content);
  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
