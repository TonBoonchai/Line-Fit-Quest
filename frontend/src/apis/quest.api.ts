import ApiService from "../services/api.service";
import { Quest } from "../types/quest.type";

export async function generateQuestApi(
  lineUserId: string,
  purpose?: string
): Promise<Quest> {
  const response = await ApiService.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quests/${lineUserId}`,
    { purpose: purpose }
  );
  return response.data.quest;
}

export async function getUserQuestsApi(lineUserId: string): Promise<Quest[]> {
  const response = await ApiService.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quests/${lineUserId}`
  );
  return response.data.quests;
}

export async function completeQuestApi(questId: number): Promise<Quest> {
  const response = await ApiService.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quests/complete/${questId}`
  );
  return response.data.quest;
}

export async function getTodayQuestStatsApi(
  lineUserId: string
): Promise<{ completed: number; total: number }> {
  const response = await ApiService.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quests/today/${lineUserId}`
  );
  return response.data;
}
