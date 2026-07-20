import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import type { Project } from "../../domain/project";
import type {
  CreateProjectData,
  ProjectRepository,
} from "../../domain/project-repository";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
} from "../project-use-cases";

/**
 * In-memory repository that enforces the same userId scoping as the Drizzle
 * implementation — a faithful proxy for row-ownership (RLS) at the app level.
 */
class FakeProjectRepository implements ProjectRepository {
  private rows: Project[] = [];
  private seq = 0;

  constructor(seed: Project[] = []) {
    this.rows = [...seed];
  }

  async create(data: CreateProjectData): Promise<Project> {
    const now = new Date();
    const project: Project = {
      id: `p${++this.seq}`,
      userId: data.userId,
      title: data.title,
      ideaInput: data.ideaInput,
      context: data.context,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    this.rows.push(project);
    return project;
  }

  async listByUser(userId: string): Promise<Project[]> {
    return this.rows.filter((row) => row.userId === userId);
  }

  async findById(id: string, userId: string): Promise<Project | null> {
    return this.rows.find((row) => row.id === id && row.userId === userId) ?? null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const index = this.rows.findIndex(
      (row) => row.id === id && row.userId === userId,
    );
    if (index === -1) return false;
    this.rows.splice(index, 1);
    return true;
  }

  async countByUser(userId: string): Promise<number> {
    return this.rows.filter((row) => row.userId === userId).length;
  }
}

const validInput = {
  title: "Rancang Ide",
  ideaInput: "A tool that validates product ideas before you build them.",
  context: null,
};

describe("createProject", () => {
  it("persists a valid project and returns it", async () => {
    const repo = new FakeProjectRepository();
    const project = await createProject(repo, "user-1", validInput);

    expect(project.id).toBeTruthy();
    expect(project.userId).toBe("user-1");
    expect(project.title).toBe("Rancang Ide");
    expect(await repo.countByUser("user-1")).toBe(1);
  });

  it("rejects an idea that is too short and persists nothing", async () => {
    const repo = new FakeProjectRepository();
    await expect(
      createProject(repo, "user-1", { title: "X", ideaInput: "too short" }),
    ).rejects.toBeInstanceOf(ZodError);
    expect(await repo.countByUser("user-1")).toBe(0);
  });

  it("rejects an empty title", async () => {
    const repo = new FakeProjectRepository();
    await expect(
      createProject(repo, "user-1", { ...validInput, title: "" }),
    ).rejects.toBeInstanceOf(ZodError);
  });
});

describe("listProjects", () => {
  it("returns only the requesting user's projects", async () => {
    const repo = new FakeProjectRepository();
    await createProject(repo, "user-1", validInput);
    await createProject(repo, "user-2", validInput);

    const list = await listProjects(repo, "user-1");
    expect(list).toHaveLength(1);
    expect(list[0]?.userId).toBe("user-1");
  });
});

describe("ownership (RLS proxy)", () => {
  it("does not return another user's project", async () => {
    const repo = new FakeProjectRepository();
    const owned = await createProject(repo, "owner", validInput);

    expect(await getProject(repo, "owner", owned.id)).not.toBeNull();
    expect(await getProject(repo, "attacker", owned.id)).toBeNull();
  });

  it("does not let another user delete a project", async () => {
    const repo = new FakeProjectRepository();
    const owned = await createProject(repo, "owner", validInput);

    expect(await deleteProject(repo, "attacker", owned.id)).toBe(false);
    expect(await getProject(repo, "owner", owned.id)).not.toBeNull();

    expect(await deleteProject(repo, "owner", owned.id)).toBe(true);
    expect(await getProject(repo, "owner", owned.id)).toBeNull();
  });
});
