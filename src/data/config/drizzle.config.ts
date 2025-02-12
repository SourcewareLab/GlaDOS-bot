import type { Config } from 'drizzle-kit';
import { connectionString } from './database.config.js';

/**
 * Configuration for Drizzle Kit.
 * Specifies the schema location, migration output directory, and database credentials.
 */
export default {
  schema: './src/data/models/*.ts',
  out: './src/data/migrations',
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString
  },
  introspect:{
    casing: 'camel'
  },
  verbose: true,
  strict: true
} satisfies Config;