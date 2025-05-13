import { z } from "zod";

export const statlineSchema = z.object({
  fieldGoalsMade: z.number().int().nonnegative().default(0),
  fieldGoalsMissed: z.number().int().nonnegative().default(0),
  threePointersMade: z.number().int().nonnegative().default(0),
  threePointersMissed: z.number().int().nonnegative().default(0),
  freeThrows: z.number().int().nonnegative().default(0),
  missedFreeThrows: z.number().int().nonnegative().default(0),
  assists: z.number().int().nonnegative().default(0),
  steals: z.number().int().nonnegative().default(0),
  turnovers: z.number().int().nonnegative().default(0),
  rebounds: z.number().int().nonnegative().default(0),
  blocks: z.number().int().nonnegative().default(0),
});

export type StatlineData = z.infer<typeof statlineSchema>;
