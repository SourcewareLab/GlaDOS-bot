import { AppDatabase } from "./database.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Applies database migrations using Drizzle.
 * This function ensures the migrations folder is correctly resolved in an ESM context.
 */
export async function runMigrations() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    await migrate(AppDatabase.getInstance().db, {
      migrationsFolder: path.join(__dirname, "migrations"),
    });
    console.log("Migrations applied successfully");
  } catch (err) {
    console.error("Error applying migrations:", err);
    process.exit(1);
  }
}
