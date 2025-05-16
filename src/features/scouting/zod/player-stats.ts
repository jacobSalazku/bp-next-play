import { z } from "zod";

export const statlineSchema = z.object({
  fieldGoalsMade: z.number().int().nonnegative().default(0).optional(),
  fieldGoalsMissed: z.number().int().nonnegative().default(0).optional(),
  threePointersMade: z.number().int().nonnegative().default(0).optional(),
  threePointersMissed: z.number().int().nonnegative().default(0).optional(),
  freeThrows: z.number().int().nonnegative().default(0).optional(),
  missedFreeThrows: z.number().int().nonnegative().default(0).optional(),
  assists: z.number().int().nonnegative().default(0).optional(),
  steals: z.number().int().nonnegative().default(0).optional(),
  turnovers: z.number().int().nonnegative().default(0).optional(),
  rebounds: z.number().int().nonnegative().default(0).optional(),
  blocks: z.number().int().nonnegative().default(0).optional(),
});

export type StatlineData = z.infer<typeof statlineSchema>;

export const playerWithStats = z.object({
  id: z.string(),
  activityId: z.string(),
  statlines: z.array(statlineSchema),
});

export const playersDataSchema = z.object({
  players: z.array(playerWithStats),
});
