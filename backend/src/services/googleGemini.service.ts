import { GoogleGenerativeAI } from "@google/generative-ai";

export default class googleGeminiService {
  // Google Gemini service methods will be implemented here in the future

  static genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

  static async sendMessageToGemini(userMessage: string) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(userMessage);
    const response = result.response;

    return response.text();
  }
}
