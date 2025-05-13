import type { StatlineData } from "../zod/player-stats";

export const STAT_BUTTONS: { label: string; key: keyof StatlineData }[] = [
  { label: "FG Made", key: "fieldGoalsMade" },
  { label: "FG Missed", key: "fieldGoalsMissed" },
  { label: "3PT Made", key: "threePointersMade" },
  { label: "3PT Missed", key: "threePointersMissed" },
  { label: "FT Made", key: "freeThrows" },
  { label: "FT Missed", key: "missedFreeThrows" },
  { label: "Assists", key: "assists" },
  { label: "Steals", key: "steals" },
  { label: "Turnovers", key: "turnovers" },
  { label: "Rebounds", key: "rebounds" },
];
