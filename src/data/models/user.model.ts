import { pgTable, bigint, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

/**
 * Defines the `users` table schema.
 */
export const users = pgTable('users', {
  discordId: bigint({mode: "bigint"}).primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  score: integer('score').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Type for selecting user records.
 */
export type User = typeof users.$inferSelect;

/**
 * Type for inserting new user records.
 */
export type NewUser = typeof users.$inferInsert;