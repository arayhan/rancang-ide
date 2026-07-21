"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { getUserPlan } from "@/features/auth/infrastructure/profile";
import { getSessionUserId } from "@/features/auth/infrastructure/session";
import type { Project } from "@/features/projects/domain/project";
import { deriveTitleFromIdea } from "@/features/projects/domain/title";
import type { CreateProjectState } from "@/features/projects/domain/types";
import {
  createProject,
  deleteProject,
} from "@/features/projects/application/project-use-cases";
import { DrizzleProjectRepository } from "@/features/projects/infrastructure/drizzle-project-repository";
import { isAtProjectLimit } from "@/shared/domain/quota";

const repo = new DrizzleProjectRepository();

/** Create a project from the new-project form, then open it. */
export async function createProjectAction(
  _prevState: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  // Enforce the free project limit (defense-in-depth; the UI shows a paywall).
  const [plan, count] = await Promise.all([
    getUserPlan(userId),
    repo.countByUser(userId),
  ]);
  if (isAtProjectLimit(plan, count)) {
    return { error: "You've reached the free limit of 3 projects. Upgrade to add more." };
  }

  const ideaInput = String(formData.get("ideaInput") ?? "").trim();
  const titleInput = String(formData.get("title") ?? "").trim();
  const targetUser = String(formData.get("targetUser") ?? "").trim();
  const constraints = String(formData.get("constraints") ?? "").trim();
  const notes = String(formData.get("context") ?? "").trim();

  const context: Record<string, unknown> = {};
  if (targetUser) context.target_user = targetUser;
  if (constraints) context.constraints = constraints;
  if (notes) context.notes = notes;

  const rawInput = {
    title: titleInput.length > 0 ? titleInput : deriveTitleFromIdea(ideaInput),
    ideaInput,
    context: Object.keys(context).length > 0 ? context : null,
  };

  let project: Project;
  try {
    project = await createProject(repo, userId, rawInput);
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Please check your input." };
    }
    throw error;
  }

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

/** Delete a project owned by the current user, then refresh the list. */
export async function deleteProjectAction(formData: FormData): Promise<void> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteProject(repo, userId, id);
    revalidatePath("/projects");
  }
}
