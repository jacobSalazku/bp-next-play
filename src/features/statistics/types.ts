export type Week = {
  label: string;
  start: string;
  end: string;
  month: number;
  startDate: Date;
  endDate: Date;
};

export type StatSelect =
  | "assists"
  | "rebounds"
  | "blocks"
  | "fieldGoalsMade"
  | "fieldGoalsMissed"
  | "threePointersMade"
  | "threePointersMissed"
  | "freeThrows"
  | "missedFreeThrows"
  | "steals"
  | "turnovers";

export type ActivityStat = {
  value: number | undefined;
  date: string | null;
  title: string | null;
};
