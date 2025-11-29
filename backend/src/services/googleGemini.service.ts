import { GoogleGenerativeAI } from "@google/generative-ai";
import { title } from "process";
import { usersTable } from "../db/schema";
import { GoogleGenAI } from "@google/genai";
import { eq } from "drizzle-orm";
import { db } from "../db";

export default class googleGeminiService {
  static genAI = (() => {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    console.log("API Key loaded:", apiKey.substring(0, 10) + "..."); // Show first 10 chars only
    return new GoogleGenerativeAI(apiKey);
  })();

  static async sendMessageToGemini(userId: number, purpose: string) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
      });
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      if (!user || user.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }

      const userData = user[0];

      const prompt = `Generate a quest based on the following user purpose:
      ${purpose} (not too hard)
      The quest should include a title(length<50), description(length<80), Health Points(2-10), Energy Points(2-10), Goal is how amount of activity user must do(2-5), and Experience points(5-10).
     
      example format:
        Title: seems like a good day for a run
        Description: Go for a 5km run in your neighborhood to boost your fitness.
        Health Points: 7
        Energy Points: 6
        Goal: 5
        Experience Points: 5

      Output format:
        Title: <quest title>
        Description: <quest description>
        Health Points: <number>
        Energy Points: <number>
        Goal: <number>
        Experience Points: <number>
     `;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Split by newline and parse
      const lines = response.split("\n").filter((line) => line.trim());

      const questData: any = {};

      lines.forEach((line) => {
        if (line.includes("Title:")) {
          questData.title = line.split("Title:")[1].trim();
        } else if (line.includes("Description:")) {
          questData.description = line.split("Description:")[1].trim();
        } else if (line.includes("Health Points:")) {
          questData.healthPoints = parseInt(
            line.split("Health Points:")[1].trim()
          );
        } else if (line.includes("Energy Points:")) {
          questData.energyPoints = parseInt(
            line.split("Energy Points:")[1].trim()
          );
        } else if (line.includes("Goal:")) {
          questData.goal = parseInt(line.split("Goal:")[1].trim());
        } else if (line.includes("Experience Points:")) {
          questData.expPoints = parseInt(
            line.split("Experience Points:")[1].trim()
          );
        }
      });

      return questData;
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to generate quest from Gemini");
    }
  }

  static async sendImage(message: string) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });
      const prompt = `Generate an image based on this description: ${message}`;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      return response;
    } catch (error) {
      console.error("Gemini Image API error:", error);
      throw new Error("Failed to generate image from Gemini");
    }
  }
}
