import { z } from "zod";

export const getPlayerStatSchema = z.object({
  teamMemberId: z.string(),
  activityId: z.string(),
  stat: z.enum([
    "assists",
    "rebounds",
    "blocks",
    "fieldGoalsMade",
    "fieldGoalsMissed",
    "threePointersMade",
    "threePointersMissed",
    "freeThrows",
    "missedFreeThrows",
    "steals",
    "turnovers",
  ]),
  startDate: z.string(),
  endDate: z.string(),
});

export const getPointsPerGameStatSchema = z.object({
  teamMemberId: z.string(),
  activityId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export type GetPlayerStatInput = z.infer<typeof getPlayerStatSchema>;

export type GetPointsPerGameStatInput = z.infer<
  typeof getPointsPerGameStatSchema
>;

type StatAverages = {
  averagePointsPerGame: number;
  averageFieldGoalsMade: number;
  averageThreePointersMade: number;
  averageFreeThrowsMade: number;
  averageAssists: number;
  averageRebounds: number;
  averageSteals: number;
  averageBlocks: number;
  averageTurnovers: number;
};

export type StatlineAverageResult = {
  totalPoints: number;
  averagePointsPerGame: number;
  averages: StatAverages;
};
