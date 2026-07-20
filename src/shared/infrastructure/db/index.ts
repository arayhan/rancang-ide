import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../../../../drizzle/schema";

type Database = ReturnType<typeof createDb>;

let db: Database | undefined;

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Missing environment variable: DATABASE_URL");
  }
  // prepare: false — required for Supabase's transaction-mode connection pooler.
  const client = postgres(url, { prepare: false });
  return drizzle(client, { schema });
}

/**
 * Drizzle database handle (lazy singleton, server only).
 * Import from infrastructure layers exclusively — never from domain/application.
 */
export function getDb(): Database {
  db ??= createDb();
  return db;
}
