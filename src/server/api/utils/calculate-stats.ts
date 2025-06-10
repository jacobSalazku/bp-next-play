export function safeSum(value: number | null): number {
  return value ?? 1;
}

export function calculatePercentage(made: number, missed: number): number {
  const attempted = made + missed;
  return attempted > 0 ? (made / attempted) * 100 : 0;
}

export function calculateTotalPoints({
  fieldGoalsMade,
  threePointersMade,
  freeThrows,
}: {
  fieldGoalsMade: number;
  threePointersMade: number;
  freeThrows: number;
}): number {
  const twoPointersMade = fieldGoalsMade - threePointersMade;
  return twoPointersMade * 2 + threePointersMade * 3 + freeThrows;
}

export function calculateTrueShootingPercentage({
  points,
  fieldGoalsAttempted,
  freeThrowsAttempted,
}: {
  points: number;
  fieldGoalsAttempted: number;
  freeThrowsAttempted: number;
}): number {
  const totalAttempts = fieldGoalsAttempted + 0.44 * freeThrowsAttempted;
  return totalAttempts > 0 ? (points / (2 * totalAttempts)) * 100 : 0;
}

export function calculateAssistToTurnoverRatio({
  assists,
  turnovers,
}: {
  assists: number;
  turnovers: number;
}): number {
  return turnovers > 0 ? assists / turnovers : 0;
}

export function calculateOffensiveRating({
  points,
  fieldGoalAttempts,
  freeThrowAttempts,
  turnovers,
  offensiveRebounds,
}: {
  points: number;
  fieldGoalAttempts: number;
  freeThrowAttempts: number;
  turnovers: number;
  offensiveRebounds: number;
}): number {
  const possessions =
    fieldGoalAttempts - offensiveRebounds + turnovers + 0.4 * freeThrowAttempts;

  return possessions > 0 ? (points / possessions) * 100 : 0;
}

export function calculateTotalOpponentPoints(
  fieldGoalsMade: number | null,
  threePointersMade: number | null,
  freeThrowsMade: number | null,
): number {
  const twos = (fieldGoalsMade ?? 0) - (threePointersMade ?? 0);
  const threes = threePointersMade ?? 0;
  const frees = freeThrowsMade ?? 0;

  return twos * 2 + threes * 3 + frees;
}

export function calculateNetRating({
  pointsScored,
  pointsAllowed,
  fieldGoalAttempts,
  offensiveRebounds,
  turnovers,
  freeThrowAttempts,
}: {
  pointsScored: number;
  pointsAllowed: number;
  fieldGoalAttempts: number;
  offensiveRebounds: number;
  turnovers: number;
  freeThrowAttempts: number;
}) {
  const possessions =
    fieldGoalAttempts -
    offensiveRebounds +
    turnovers +
    0.44 * freeThrowAttempts;

  if (possessions === 0) return 0; // Avoid division by zero

  const netRating = ((pointsScored - pointsAllowed) / possessions) * 100;

  return netRating;
}

export function calculateEffectiveFieldGoalPercentage({
  fieldGoalsMade,
  threePointersMade,
  fieldGoalsAttempted,
}: {
  fieldGoalsMade: number;
  threePointersMade: number;
  fieldGoalsAttempted: number;
}): number {
  if (fieldGoalsAttempted === 0) return 0; // Avoid division by zero
  const eFG = (fieldGoalsMade + 0.5 * threePointersMade) / fieldGoalsAttempted;

  return eFG * 100; // Return as percentage
}
