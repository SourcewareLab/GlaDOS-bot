import { User as DiscordUser} from 'discord.js';
import {  eq, sql } from 'drizzle-orm';
import { users, User } from '@/data/models/user.model.js'; // Assuming you've defined the `users` table schema
import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * Repository for managing user-related database operations.
 */
export class UserRepository {

  readonly db : ReturnType<typeof drizzle>;

  /**
   * Initializes the repository with a Drizzle instance.
   */
  constructor(db : ReturnType<typeof drizzle>) {
    this.db = db;
  }

  /**
   * Adds points to a user's score. If the user doesn't exist, they are created.
   */
  async addScoreToUser(user: DiscordUser, points: number): Promise<void> {
    const { id, username } = user;

    await this.db
      .insert(users)
      .values({
        discordId: BigInt(id),
        username,
        score: points, // Initial score for new users
      })
      .onConflictDoUpdate({
        target: users.discordId,
        set: {
          username,
          score: sql`${users.score} + ${points}`, // Increment score for existing users
        },
      });
  }

  /**
   * Fetches the leaderboard with the top users by score.
   */
  async getLeaderboard(limit: number): Promise<User[]> {
    return await this.db
      .select()
      .from(users)
      .orderBy(sql`${users.score} DESC`)
      .limit(limit);
  }

  /**
   * Fetches a user's score. If the user doesn't exist, they are created with a score of 0.
   */
  async getUserScore(user: DiscordUser): Promise<User> {
    const { id, username } = user;

    await this.db
      .insert(users)
      .values({
        discordId: BigInt(id),
        username,
        score: 0, // Initial score for new users
      })
      .onConflictDoUpdate({
        target: users.discordId,
        set: { username },
      });

    const [userRecord] = await this.db
      .select()
      .from(users)
      .where(eq(users.discordId, BigInt(id)));

    return userRecord;
  }
}