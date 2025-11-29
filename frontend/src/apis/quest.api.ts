import ApiService from "../services/api.service";
import { Quest } from "../types/quest.type";

export async function generateQuestApi(userId: number): Promise<Quest> {
  const response = await ApiService.post(
    `${process.env.BACKEND_URl}/quests/${userId}`
  );
  return response.data.quest;
}

export async function getUserQuestsApi(userId: number): Promise<Quest[]> {
  const response = await ApiService.get(
    `${process.env.BACKEND_URl}/quests/${userId}`
  );
  return response.data.quests;
}

export async function completeQuestApi(questId: number): Promise<Quest> {
  const response = await ApiService.post(
    `${process.env.BACKEND_URl}/quests/complete/${questId}`
  );
  return response.data.quest;
}
