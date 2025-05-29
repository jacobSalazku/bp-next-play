import type { Context } from "../trpc";

export async function countGamesAttended(
  ctx: Context,
  teamMemberId: string,
  gameActivityIds: string[],
) {
  if (gameActivityIds.length === 0) return 0;

  const gamesAttended = await ctx.db.activityAttendance.count({
    where: {
      teamMemberId,
      activityId: { in: gameActivityIds },
      attendanceStatus: "ATTENDING",
    },
  });

  return gamesAttended;
}
