import type { Project, ProjectStatus } from "./project";

/** Data needed to persist a new project (userId comes from the session). */
export type CreateProjectData = {
  userId: string;
  title: string;
  ideaInput: string;
  context: Record<string, unknown> | null;
};

/**
 * Persistence contract for projects. Declared in the domain (dependency
 * inversion); implemented in infrastructure with Drizzle.
 *
 * Every read/write is scoped by userId: the Drizzle connection runs as a
 * privileged role that bypasses RLS, so ownership is enforced in-query as
 * defense-in-depth (RLS remains the second layer for Supabase-client access).
 */
export interface ProjectRepository {
  create(data: CreateProjectData): Promise<Project>;
  listByUser(userId: string): Promise<Project[]>;
  findById(id: string, userId: string): Promise<Project | null>;
  delete(id: string, userId: string): Promise<boolean>;
  countByUser(userId: string): Promise<number>;
  updateStatus(id: string, userId: string, status: ProjectStatus): Promise<void>;
}
