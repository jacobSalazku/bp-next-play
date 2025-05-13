import type { StatlineData } from "../zod/player-stats";

export function calculateStats(stats: StatlineData) {
  // Field Goals
  const fieldGoalsMade =
    (stats.fieldGoalsMade ?? 0) + (stats.threePointersMade ?? 0);
  const fieldGoalsAttemped =
    fieldGoalsMade +
    (stats.fieldGoalsMissed ?? 0) +
    (stats.threePointersMissed ?? 0);

  const fgPercent = (
    (fieldGoalsMade / (fieldGoalsAttemped || 1)) *
    100
  ).toFixed(0);

  // Three Pointers
  const threePointMade = stats.threePointersMade ?? 0;
  const threePointAttempted = threePointMade + (stats.threePointersMissed ?? 0);
  const tpPercent = (
    (threePointMade / (threePointAttempted || 1)) *
    100
  ).toFixed(0);

  // Free Throws
  const freeThrowsMade = stats.freeThrows ?? 0;
  const freeThrowsAttempted = freeThrowsMade + (stats.missedFreeThrows ?? 0);
  const ftPercent = (
    (freeThrowsMade / (freeThrowsAttempted || 1)) *
    100
  ).toFixed(0);

  const totalPoints =
    (fieldGoalsMade - threePointMade) * 2 + threePointMade * 3 + freeThrowsMade;

  const fieldGoals = {
    made: fieldGoalsMade,
    attempted: fieldGoalsAttemped,
    percentage: fgPercent,
  };
  const threePointers = {
    made: threePointMade,
    attempted: threePointAttempted,
    percentage: tpPercent,
  };
  const freeThrows = {
    made: freeThrowsMade,
    attempted: freeThrowsAttempted,
    percentage: ftPercent,
  };

  return {
    fieldGoals,
    threePointers,
    freeThrows,
    totalPoints,
  };
}
