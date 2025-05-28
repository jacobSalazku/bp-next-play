import { z } from "zod";

const statField = () =>
  z.preprocess((val) => Number(val ?? 0), z.number().int().nonnegative());

export const statlineSchema = z.object({
  id: z.string(),
  fieldGoalsMade: statField(),
  fieldGoalsMissed: statField(),
  threePointersMade: statField(),
  threePointersMissed: statField(),
  freeThrows: statField(),
  missedFreeThrows: statField(),
  assists: statField(),
  steals: statField(),
  turnovers: statField(),
  rebounds: statField(),
  blocks: statField(),
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
