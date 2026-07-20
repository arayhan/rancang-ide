import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Use the direct (non-pooled, port 5432) connection for migrations.
    url: process.env.DATABASE_URL ?? "",
  },
});
