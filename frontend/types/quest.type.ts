import { z } from "zod";

export const QuestSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  description: z.string(),
  healthPoints: z.number(),
  energyPoints: z.number(),
  expPoints: z.number(),
  progress: z.number(),
  goal: z.number(),
});

export type Quest = z.infer<typeof QuestSchema>;
