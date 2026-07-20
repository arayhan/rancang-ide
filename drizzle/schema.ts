// Drizzle schema — single source of truth for the database.
// Migrations are generated in-repo via `pnpm db:generate`, never in the dashboard.
// RLS is declared here (policies + auto-enabled) so it ships with every migration.

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUid, authUsers } from "drizzle-orm/supabase";

export const planEnum = pgEnum("plan", ["free", "pro"]);
export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "validated",
  "structured",
  "spec_ready",
]);

/**
 * profiles — one row per authenticated user (id = auth.users.id).
 * Upserted on first login (see the auth callback). RLS: a user sees only their own row.
 */
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    displayName: text("display_name"),
    plan: planEnum("plan").notNull().default("free"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("profiles_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.id}`,
    }),
    pgPolicy("profiles_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${authUid} = ${table.id}`,
    }),
    pgPolicy("profiles_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.id}`,
      withCheck: sql`${authUid} = ${table.id}`,
    }),
  ],
);

/**
 * projects — a user's product ideas. RLS: a user can only touch rows they own
 * (auth.uid() = user_id). Indexed on user_id for history listing (PRD §7).
 */
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    ideaInput: text("idea_input").notNull(),
    context: jsonb("context"),
    status: projectStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("projects_user_id_idx").on(table.userId),
    pgPolicy("projects_all_own", {
      for: "all",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.userId}`,
      withCheck: sql`${authUid} = ${table.userId}`,
    }),
  ],
);

export const verdictEnum = pgEnum("verdict", ["strong", "weak", "pivot"]);
export const generationStageEnum = pgEnum("generation_stage", [
  "validation",
  "structure",
  "prd",
  "tasks",
]);

/**
 * validations — one validation report per run for a project. RLS: a user can
 * touch a row only if they own the parent project.
 */
export const validations = pgTable(
  "validations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    verdict: verdictEnum("verdict").notNull(),
    report: jsonb("report").notNull(),
    modelUsed: text("model_used").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("validations_project_id_idx").on(table.projectId),
    pgPolicy("validations_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`exists (select 1 from ${projects} where ${projects.id} = ${table.projectId} and ${projects.userId} = ${authUid})`,
    }),
    pgPolicy("validations_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`exists (select 1 from ${projects} where ${projects.id} = ${table.projectId} and ${projects.userId} = ${authUid})`,
    }),
  ],
);

/**
 * generations — usage log for cost & quota tracking. One row per AI call.
 * RLS: owner-only via user_id.
 */
export const generations = pgTable(
  "generations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    stage: generationStageEnum("stage").notNull(),
    model: text("model").notNull(),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("generations_user_id_idx").on(table.userId),
    pgPolicy("generations_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.userId}`,
    }),
    pgPolicy("generations_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${authUid} = ${table.userId}`,
    }),
  ],
);

export type ProfileRow = typeof profiles.$inferSelect;
export type NewProfileRow = typeof profiles.$inferInsert;
export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
export type ValidationRow = typeof validations.$inferSelect;
export type NewValidationRow = typeof validations.$inferInsert;
export type GenerationRow = typeof generations.$inferSelect;
export type NewGenerationRow = typeof generations.$inferInsert;
