import { and, desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/shared/infrastructure/db";

import { projects, type ProjectRow } from "../../../../drizzle/schema";
import type { Project } from "../domain/project";
import type {
  CreateProjectData,
  ProjectRepository,
} from "../domain/project-repository";

function toDomain(row: ProjectRow): Project {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    ideaInput: row.ideaInput,
    context: (row.context as Record<string, unknown> | null) ?? null,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** Drizzle-backed ProjectRepository. All queries are scoped by userId. */
export class DrizzleProjectRepository implements ProjectRepository {
  async create(data: CreateProjectData): Promise<Project> {
    const [row] = await getDb()
      .insert(projects)
      .values({
        userId: data.userId,
        title: data.title,
        ideaInput: data.ideaInput,
        context: data.context,
      })
      .returning();
    return toDomain(row);
  }

  async listByUser(userId: string): Promise<Project[]> {
    const rows = await getDb()
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
    return rows.map(toDomain);
  }

  async findById(id: string, userId: string): Promise<Project | null> {
    const [row] = await getDb()
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .limit(1);
    return row ? toDomain(row) : null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const rows = await getDb()
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning({ id: projects.id });
    return rows.length > 0;
  }

  async countByUser(userId: string): Promise<number> {
    const [row] = await getDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(eq(projects.userId, userId));
    return row?.count ?? 0;
  }
}
