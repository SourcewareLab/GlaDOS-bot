import { dbConfig, connectionString } from "./config/database.config.js";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { UserRepository } from "@/data/repositories/user.repository.js";

/**
 * Singleton class for managing the database connection and repositories.
 * Ensures only one instance of the database is created and shared across the application.
 */
export class AppDatabase {
  private static instance: AppDatabase;
  //drizzle has a verbose type so I'm using this
  readonly db: ReturnType<typeof drizzle>;

  // Repositories are initialized later on by initialize method
  userRepository: UserRepository | null = null;

  /**
   * Returns the singleton instance of AppDatabase.
   */
  public static getInstance(): AppDatabase {
    if (!AppDatabase.instance) {
      AppDatabase.instance = new AppDatabase();
    }
    return AppDatabase.instance;
  }

  /**
   * Prevents direct instantiation. Use `getInstance()` instead.
   */
  private constructor() {
    this.db = drizzle({ connection: connectionString, casing: "snake_case" });
  }

  /**
   * Creates the database if it doesn't already exist.
   * Connects to the default `postgres` database to check and create the target database.
   */
  private async createDatabaseIfNotExists() {
    const { username, password, database, host, port } = dbConfig;

    // Connect to the default postgres database to create new target db
    const adminClient = new pg.Client({
      host,
      port,
      user: username,
      password,
      database: "postgres",
    });

    try {
      await adminClient.connect();
      const res = await adminClient.query(
        `SELECT 1
                 FROM pg_database
                 WHERE datname = '${database}'`,
      );

      if (res.rowCount === 0) {
        await adminClient.query(`CREATE DATABASE "${database}"`);
        console.log(`Database ${database} created successfully`);
      }
    } catch (err) {
      console.error("Error creating database:", err);
      throw err;
    } finally {
      await adminClient.end();
    }
  }

  /**
   * Initializes the database and repositories.
   */
  public async initialize() {
    try {
      await this.createDatabaseIfNotExists();
      this.initializeRepositories();
    } catch (err) {
      console.error("Unable to connect to the database:", err);
      throw err;
    }
  }

  /**
   * Initializes repositories. Add new repositories here as needed.
   */
  private initializeRepositories() {
    this.userRepository = new UserRepository(this.db);
  }
}
