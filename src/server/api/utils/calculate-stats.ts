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
