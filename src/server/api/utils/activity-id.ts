export function getActivityIds(activities: { id: string; type: string }[]) {
  const activityIds = activities.map((a) => a.id);
  const gameActivityIds = activities
    .filter((a) => a.type === "Game")
    .map((a) => a.id);

  return { activityIds, gameActivityIds };
}
