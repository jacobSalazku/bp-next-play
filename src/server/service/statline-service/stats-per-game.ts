import type { Context } from "@/server/api/trpc";
import { ActivityType } from "@prisma/client";

export async function getStatsPerGame(
  ctx: Context,
  teamMemberId: string,
  teamId: string,
  year: number,
  month: number,
) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  const currentDate = new Date();

  // Fetch statlines for the player between dates
  const statlines = await ctx.db.statline.findMany({
    where: {
      teamMemberId,
      activity: {
        type: ActivityType.GAME,
        attendees: { some: { attendanceStatus: "ATTENDING" } },
        date: {
          gte: startDate,
          lte: endDate,
          lt: currentDate,
        },
        teamId: teamId,
      },
    },
    select: {
      fieldGoalsMade: true,
      threePointersMade: true,
      freeThrows: true,
      assists: true,
      offensiveRebounds: true,
      defensiveRebounds: true,
      steals: true,
      activity: {
        select: { date: true, title: true },
      },
    },
    orderBy: {
      activity: {
        date: "asc",
      },
    },
  });

  if (!statlines || statlines.length === 0) {
    return [
      {
        gameTitle: "No Games",
        date: null,
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
      },
    ];
  }

  const statsPerGameStats = statlines.map((entry) => {
    const activity = entry.activity;
    const points =
      ((entry.fieldGoalsMade ?? 0) - (entry.threePointersMade ?? 0)) * 2 +
      (entry.threePointersMade ?? 0) * 3 +
      (entry.freeThrows ?? 0);

    return {
      gameTitle: activity?.title ?? "Untitled Game",
      date: activity?.date ?? null,
      points,
      assists: entry.assists ?? 0,
      rebounds: (entry.offensiveRebounds ?? 0) + (entry.defensiveRebounds ?? 0),
      steals: entry.steals ?? 0,
    };
  });

  return statsPerGameStats;
}
