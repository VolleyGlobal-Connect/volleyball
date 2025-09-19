import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// This is a singleton pattern to ensure we only have one database connection instance
// in the serverless environment.
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// Export all schemas and the db instance
export * from "./schema";