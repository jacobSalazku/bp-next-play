import type { Context } from "@/server/api/trpc";
import { safeSum } from "@/server/api/utils/calculate-stats";
import { roundToDecimal } from "@/server/api/utils/round-decimal";
import { ActivityType } from "@prisma/client";

export async function getWeeklyTeamStatlineAverages(
  ctx: Context,
  teamId: string,
) {
  const startOfTomorrow = new Date();
  startOfTomorrow.setHours(24, 0, 0, 0);

  const games = await ctx.db.activity.findMany({
    where: {
      type: ActivityType.GAME,
      teamId: teamId,
      date: { lt: startOfTomorrow },
      statlines: { some: {} },
    },
    select: { id: true, date: true },
    orderBy: { date: "asc" },
  });

  // Group game IDs by week
  const gamesByWeek: Record<string, string[]> = {};

  for (const game of games) {
    const date = new Date(game.date);
    const startOfWeek = new Date(date);
    startOfWeek.setUTCDate(date.getUTCDate() - date.getUTCDay()); // Sunday as start of week
    const weekKey: string = startOfWeek.toISOString().split("T")[0] ?? "";

    gamesByWeek[weekKey] ??= [];
    gamesByWeek[weekKey].push(game.id);
  }

  const weeklyStats = [];

  for (const [week, gameIds] of Object.entries(gamesByWeek)) {
    const totals = await ctx.db.statline.aggregate({
      where: { activityId: { in: gameIds } },
      _sum: {
        fieldGoalsMade: true,
        fieldGoalsMissed: true,
        threePointersMade: true,
        threePointersMissed: true,
        freeThrows: true,
        missedFreeThrows: true,
        assists: true,
        offensiveRebounds: true,
        defensiveRebounds: true,
        steals: true,
        blocks: true,
        turnovers: true,
      },
    });

    const totalFG = safeSum(totals._sum.fieldGoalsMade);
    const totalMissedFG = safeSum(totals._sum.fieldGoalsMissed);
    const totalFGAttempts = totalFG + totalMissedFG;

    const total3P = safeSum(totals._sum.threePointersMade);
    const totalMissed3P = safeSum(totals._sum.threePointersMissed);

    const totalFT = safeSum(totals._sum.freeThrows);
    const totalMissedFT = safeSum(totals._sum.missedFreeThrows);
    const totalFTAttempts = totalFT + totalMissedFT;

    const totalPoints = (totalFG - total3P) * 2 + total3P * 3 + totalFT;
    const gamesPlayed = gameIds.length;
    const totalRebounds =
      safeSum(totals._sum.offensiveRebounds) +
      safeSum(totals._sum.defensiveRebounds);

    weeklyStats.push({
      weekStart: week,
      gamesPlayed,
      totalPoints,
      fieldGoalsMade: roundToDecimal(totalFG),
      fieldGoalsMissed: roundToDecimal(totalMissedFG),
      threePointersMade: roundToDecimal(total3P),
      threePointersMissed: roundToDecimal(totalMissed3P),
      freeThrows: roundToDecimal(totalFT),
      missedFreeThrows: roundToDecimal(totalMissedFT),
      assists: roundToDecimal(safeSum(totals._sum.assists)),
      rebounds: roundToDecimal(
        safeSum(totals._sum.offensiveRebounds) +
          safeSum(totals._sum.defensiveRebounds),
      ),
      steals: roundToDecimal(safeSum(totals._sum.steals)),
      blocks: roundToDecimal(safeSum(totals._sum.blocks)),
      turnovers: roundToDecimal(safeSum(totals._sum.turnovers)),
      averages: {
        pointsPerGame: roundToDecimal(totalPoints / gamesPlayed),
        assist: roundToDecimal(safeSum(totals._sum.assists) / gamesPlayed),
        rebounds: roundToDecimal(totalRebounds / gamesPlayed),
        blocks: roundToDecimal(safeSum(totals._sum.blocks) / gamesPlayed),
        steals: roundToDecimal(safeSum(totals._sum.steals) / gamesPlayed),
        turnovers: roundToDecimal(safeSum(totals._sum.turnovers) / gamesPlayed),
      },
    });
  }

  return weeklyStats;
}
