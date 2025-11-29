import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

export default class UserService {
  static async findOrCreateUser(
    lineUserId: string,
    displayName: string,
    pictureUrl?: string
  ) {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.lineUserId, lineUserId))
      .limit(1);

    if (existingUser.length > 0) {
      return existingUser[0];
    }

    // Create new user
    const newUser = await db
      .insert(usersTable)
      .values({
        lineUserId,
        displayName,
        pictureUrl,
      })
      .returning();

    return newUser[0];
  }

  static async getUserByLineId(lineUserId: string) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.lineUserId, lineUserId))
      .limit(1);

    return user[0] || null;
  }
}
