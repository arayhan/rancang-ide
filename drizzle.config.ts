import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  // Supabase manages the auth roles (authenticated, anon, ...); don't try to create them.
  entities: {
    roles: {
      provider: "supabase",
    },
  },
  dbCredentials: {
    // Use the direct (non-pooled, port 5432) connection for migrations.
    url: process.env.DATABASE_URL ?? "",
  },
});
