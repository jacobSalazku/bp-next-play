import type { TeamMember } from "@/types";
import type { StatlineData } from "./player-stats";

export type PlayerWithStats = TeamMember & {
  statlines: StatlineData[];
};

export const defaultStatline: StatlineData = {
  id: "",
  fieldGoalsMade: 0,
  fieldGoalsMissed: 0,
  threePointersMade: 0,
  threePointersMissed: 0,
  freeThrows: 0,
  missedFreeThrows: 0,
  assists: 0,
  steals: 0,
  turnovers: 0,
  rebounds: 0,
  blocks: 0,
};
