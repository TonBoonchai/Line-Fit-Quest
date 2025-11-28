import googleGeminiService from "./googleGemini.service";

export default class QuestService {
  // Quest service methods will be implemented here in the future
  static async generateQuest(userData: string) {
    const quest = await googleGeminiService.sendMessageToGemini(userData);
    return quest;
  }
}
