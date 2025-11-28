import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  health: z.number(),
  energy: z.number(),
  exp: z.number(),
  rank: z.number(),
  nextLevelExp: z.number(),
});
export type User = z.infer<typeof UserSchema>;
