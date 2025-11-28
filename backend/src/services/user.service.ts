import { db } from "../db";
import { usersTable } from "../db/schema";

export default class UserService {
  // User service methods will be implemented here in the future
  static async createUser() {
    // Implementation for creating a user
    await db.insert(usersTable).values({
      displayName: "New User",
    });
  }
}
