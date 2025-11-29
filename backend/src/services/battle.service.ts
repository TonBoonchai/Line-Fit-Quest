import { db } from "../db";
import {
  battlesTable,
  battleParticipantsTable,
  usersTable,
} from "../db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import crypto from "crypto";

export default class BattleService {
  static generateInviteCode(): string {
    return crypto.randomBytes(6).toString("hex");
  }

  static async createBattle(creatorLineUserId: string) {
    // Get creator user
    const creator = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.lineUserId, creatorLineUserId))
      .limit(1);

    if (!creator[0]) {
      throw new Error("User not found");
    }

    const inviteCode = this.generateInviteCode();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 days from now

    // Create battle
    const battle = await db
      .insert(battlesTable)
      .values({
        creatorId: creator[0].id,
        inviteCode,
        endDate,
      })
      .returning();

    // Add creator as participant
    await db.insert(battleParticipantsTable).values({
      battleId: battle[0].id,
      userId: creator[0].id,
      startingExp: creator[0].exp,
    });

    return battle[0];
  }

  static async joinBattle(inviteCode: string, userLineUserId: string) {
    // Get user
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.lineUserId, userLineUserId))
      .limit(1);

    if (!user[0]) {
      throw new Error("User not found");
    }

    // Find battle by invite code
    const battle = await db
      .select()
      .from(battlesTable)
      .where(
        and(
          eq(battlesTable.inviteCode, inviteCode),
          eq(battlesTable.status, "active")
        )
      )
      .limit(1);

    if (!battle[0]) {
      throw new Error("Battle not found or already completed");
    }

    // Check if user already in battle
    const existing = await db
      .select()
      .from(battleParticipantsTable)
      .where(
        and(
          eq(battleParticipantsTable.battleId, battle[0].id),
          eq(battleParticipantsTable.userId, user[0].id)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return battle[0]; // Already joined
    }

    // Add user as participant
    await db.insert(battleParticipantsTable).values({
      battleId: battle[0].id,
      userId: user[0].id,
      startingExp: user[0].exp,
    });

    return battle[0];
  }

  static async getUserActiveBattle(userLineUserId: string) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.lineUserId, userLineUserId))
      .limit(1);

    if (!user[0]) return null;

    // Find active battle for user
    const participants = await db
      .select()
      .from(battleParticipantsTable)
      .where(eq(battleParticipantsTable.userId, user[0].id))
      .limit(1);

    if (participants.length === 0) return null;

    const battle = await db
      .select()
      .from(battlesTable)
      .where(
        and(
          eq(battlesTable.id, participants[0].battleId),
          eq(battlesTable.status, "active"),
          gte(battlesTable.endDate, new Date())
        )
      )
      .limit(1);

    return battle[0] || null;
  }

  static async getBattleRankings(battleId: number) {
    // Get all participants with their current exp
    const participants = await db
      .select({
        userId: battleParticipantsTable.userId,
        startingExp: battleParticipantsTable.startingExp,
        displayName: usersTable.displayName,
        pictureUrl: usersTable.pictureUrl,
        currentExp: usersTable.exp,
        lineUserId: usersTable.lineUserId,
      })
      .from(battleParticipantsTable)
      .innerJoin(usersTable, eq(battleParticipantsTable.userId, usersTable.id))
      .where(eq(battleParticipantsTable.battleId, battleId));

    // Calculate exp gained during battle
    const rankings = participants.map((p) => ({
      ...p,
      expGained: p.currentExp - p.startingExp,
    }));

    // Sort by exp gained (descending)
    rankings.sort((a, b) => b.expGained - a.expGained);

    return rankings;
  }

  static async leaveBattle(userLineUserId: string, battleId: number) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.lineUserId, userLineUserId))
      .limit(1);

    if (!user[0]) {
      throw new Error("User not found");
    }

    // Remove user from battle
    await db
      .delete(battleParticipantsTable)
      .where(
        and(
          eq(battleParticipantsTable.battleId, battleId),
          eq(battleParticipantsTable.userId, user[0].id)
        )
      );

    // Check if battle is now empty
    const remaining = await db
      .select()
      .from(battleParticipantsTable)
      .where(eq(battleParticipantsTable.battleId, battleId));

    if (remaining.length === 0) {
      // Delete empty battle
      await db.delete(battlesTable).where(eq(battlesTable.id, battleId));
    }

    return { success: true };
  }
}
