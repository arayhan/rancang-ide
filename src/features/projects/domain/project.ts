/** A project's lifecycle stage (mirrors the DB enum). */
export type ProjectStatus = "draft" | "validated" | "structured" | "spec_ready";

/** Core domain entity — framework-free representation of a project. */
export type Project = {
  id: string;
  userId: string;
  title: string;
  ideaInput: string;
  context: Record<string, unknown> | null;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
};
