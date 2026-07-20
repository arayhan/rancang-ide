import { NextResponse } from "next/server";

import { getSessionUserId } from "@/features/auth/infrastructure/session";
import {
  deleteProject,
  getProject,
} from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";

const repo = new DrizzleProjectRepository();

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProject(repo, userId, id);
  if (!project) {
    // 404 (not 403) so we don't leak whether the row exists.
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  // validation + documents get attached in later phases (tables not yet present).
  return NextResponse.json({ project });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteProject(repo, userId, id);
  if (!deleted) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
