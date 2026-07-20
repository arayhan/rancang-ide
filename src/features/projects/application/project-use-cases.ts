import type { Project } from "../domain/project";
import type { ProjectRepository } from "../domain/project-repository";
import { createProjectInputSchema } from "../domain/schema";

/**
 * Use-cases orchestrate the domain + repository. The repository is injected
 * (dependency inversion) so these are unit-testable with a fake repo.
 */

/** Validate raw input and persist a new project. Throws ZodError if invalid. */
export async function createProject(
  repo: ProjectRepository,
  userId: string,
  rawInput: unknown,
): Promise<Project> {
  const input = createProjectInputSchema.parse(rawInput);
  return repo.create({
    userId,
    title: input.title,
    ideaInput: input.ideaInput,
    context: input.context ?? null,
  });
}

/** List a user's projects, most recently updated first. */
export function listProjects(
  repo: ProjectRepository,
  userId: string,
): Promise<Project[]> {
  return repo.listByUser(userId);
}

/** Fetch one project the user owns, or null. */
export function getProject(
  repo: ProjectRepository,
  userId: string,
  id: string,
): Promise<Project | null> {
  return repo.findById(id, userId);
}

/** Delete a project the user owns. Returns false if it didn't exist. */
export function deleteProject(
  repo: ProjectRepository,
  userId: string,
  id: string,
): Promise<boolean> {
  return repo.delete(id, userId);
}
