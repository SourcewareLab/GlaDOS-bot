const username = process.env.DB_USERNAME || "postgres";
const password = process.env.DB_PASSWORD ?? throwError("DB_PASSWORD");
const database = process.env.DB_NAME || "glados_dev_db";
const host = process.env.DB_HOSTNAME || "localhost";
const port = parseInt(process.env.DB_PORT || "5432");

/**
 * Connection string for the PostgreSQL database.
 */
export const connectionString = `postgres://${username}:${password}@${host}:${port}/${database}`;

/**
 * Database configuration object.
 * Includes connection details
 */
export const dbConfig = {
  username,
  password,
  database,
  host,
  port,
};

/**
 * Throws an error if a required environment variable is missing.
 */
function throwError(varName: string): never {
  throw new Error(`Missing required environment variable: ${varName}`);
}
