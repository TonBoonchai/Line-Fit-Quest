import { db } from "../db";
import { questsTable, usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import googleGeminiService from "./googleGemini.service";

export default class QuestService {
  // Quest service methods will be implemented here in the future
  static async generateQuest(userId: number) {
    const quest = await googleGeminiService.sendMessageToGemini(userId);
    const result = await db.insert(questsTable).values({
      userId: userId,
      title: quest.title,
      description: quest.description,
      healthPoints: quest.healthPoints,
      energyPoints: quest.energyPoints,
      expPoints: quest.expPoints,
      goal: quest.goal,
    });
    return result;
  }

  static async getUserQuests(userId: number) {
    const quests = await db
      .select()
      .from(questsTable)
      .where(eq(questsTable.userId, userId));
    return quests;
  }

  static async completeQuest(questId: number) {
    const quest = await db
      .update(questsTable)
      .set({ completed: true, completedAt: new Date() })
      .where(eq(questsTable.id, questId))
      .returning();
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, quest[0].userId))
      .limit(1);
    if (user[0].exp + quest[0].expPoints >= user[0].nextLevelExp) {
      await db
        .update(usersTable)
        .set({
          health: user[0].health + quest[0].healthPoints,
          energy: user[0].energy + quest[0].energyPoints,
          exp: user[0].exp + quest[0].expPoints - user[0].nextLevelExp,
          rank: user[0].rank + 1,
          nextLevelExp: Math.floor(user[0].nextLevelExp * 1.5),
        })
        .where(eq(usersTable.id, user[0].id));
    } else {
      await db
        .update(usersTable)
        .set({
          health: user[0].health + quest[0].healthPoints,
          energy: user[0].energy + quest[0].energyPoints,
          exp: user[0].exp + quest[0].expPoints,
        })
        .where(eq(usersTable.id, user[0].id));
    }
    return quest;
  }

  static async getTodayQuestStats(userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const quests = await db
      .select()
      .from(questsTable)
      .where(eq(questsTable.userId, userId));
    
    const completedToday = quests.filter(q => {
      if (!q.completedAt) return false;
      const completedDate = new Date(q.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length;
    
    return {
      completed: completedToday,
      total: quests.length
    };
  }
}
