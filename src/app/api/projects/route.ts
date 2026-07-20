import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";

import { getSessionUserId } from "@/features/auth/infrastructure/session";
import {
  createProject,
  listProjects,
} from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";

const repo = new DrizzleProjectRepository();

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const projects = await listProjects(repo, userId);
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  try {
    const project = await createProject(repo, userId, body);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "validation", issues: error.issues },
        { status: 400 },
      );
    }
    throw error;
  }
}
