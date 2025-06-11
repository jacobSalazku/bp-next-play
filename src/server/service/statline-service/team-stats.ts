import type { Context } from "@/server/api/trpc";
import {
  calculateAssistToTurnoverRatio,
  calculateEffectiveFieldGoalPercentage,
  calculateNetRating,
  calculateOffensiveRating,
  calculatePercentage,
  calculateTotalOpponentPoints,
  calculateTrueShootingPercentage,
  safeSum,
} from "@/server/api/utils/calculate-stats";
import { roundToDecimal } from "@/server/api/utils/round-decimal";
import { ActivityType } from "@prisma/client";

export async function getTeamStats(ctx: Context, teamId: string) {
  const startOfTomorrow = new Date();
  startOfTomorrow.setHours(24, 0, 0, 0);

  const totals = await ctx.db.statline.aggregate({
    where: {
      activity: {
        teamId: teamId,
        type: ActivityType.GAME,
        date: { lt: startOfTomorrow },
      },
    },
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

  // Count unique games
  const gamesCount = await ctx.db.activity.findMany({
    where: {
      type: ActivityType.GAME,
      teamId: teamId,
      date: { lt: startOfTomorrow },
      statlines: { some: {} },
    },
    select: { date: true },
  });

  const opponentStatline = await ctx.db.opponentStatline.aggregate({
    where: {
      activity: {
        is: {
          type: ActivityType.GAME,
        },
      },
    },
    _sum: {
      fieldGoalsMade: true,
      threePointersMade: true,
      freeThrowsMade: true,
    },
  });

  if (gamesCount && gamesCount.length > 0) {
    const uniqueGameDates = new Set(
      gamesCount.map((entry) => entry.date.toISOString().split("T")[0]),
    );

    const totalOpponnentPoints = calculateTotalOpponentPoints(
      opponentStatline._sum.fieldGoalsMade,
      opponentStatline._sum.threePointersMade,
      opponentStatline._sum.freeThrowsMade,
    );

    const gamesPlayed = uniqueGameDates.size;

    const totalFG = safeSum(totals._sum.fieldGoalsMade);
    const totalMissedFG = safeSum(totals._sum.fieldGoalsMissed);
    const totalFGAttempts = totalFG + totalMissedFG;

    const total3P = safeSum(totals._sum.threePointersMade);
    const totalMissed3P = safeSum(totals._sum.threePointersMissed);

    const totalFT = safeSum(totals._sum.freeThrows);
    const totalMissedFT = safeSum(totals._sum.missedFreeThrows);
    const totalFTAttempts = totalFT + totalMissedFT;

    const totalOffensiveRebounds = totals._sum.offensiveRebounds ?? 0;
    const totalDefensiveRebounds = totals._sum.defensiveRebounds ?? 0;
    const totalRebounds = totalOffensiveRebounds + totalDefensiveRebounds;

    const totalFieldGoalPercentage = calculatePercentage(
      totalFG,
      totalMissedFG,
    );

    const totalThreePointPercentage = calculatePercentage(
      total3P,
      totalMissed3P,
    );

    const totalFreeThrowPercentage = calculatePercentage(
      totalFT,
      totalMissedFT,
    );

    const totalPoints = (totalFG - total3P) * 2 + total3P * 3 + totalFT;

    const netRating = calculateNetRating({
      pointsScored: totalPoints,
      pointsAllowed: totalOpponnentPoints,
      fieldGoalAttempts: totalFGAttempts,
      offensiveRebounds: totalOffensiveRebounds,
      turnovers: safeSum(totals._sum.turnovers),
      freeThrowAttempts: totalFTAttempts,
    });

    const offensiveRating = calculateOffensiveRating({
      points: totalPoints,
      fieldGoalAttempts: totalFGAttempts,
      freeThrowAttempts: totalFTAttempts,
      turnovers: safeSum(totals._sum.turnovers),
      offensiveRebounds: safeSum(totals._sum.offensiveRebounds ?? 0),
    });

    const trueShootingPercentage = calculateTrueShootingPercentage({
      points: totalPoints,
      fieldGoalsAttempted: totalFGAttempts,
      freeThrowsAttempted: totalFTAttempts,
    });

    const assistToTurnoverRatio = calculateAssistToTurnoverRatio({
      assists: safeSum(totals._sum.assists),
      turnovers: safeSum(totals._sum.turnovers),
    });

    const effectiveFieldGoalPercentage = calculateEffectiveFieldGoalPercentage({
      fieldGoalsMade: totalFG,
      threePointersMade: total3P,
      fieldGoalsAttempted: totalFGAttempts,
    });

    return {
      date: gamesCount[0]?.date,
      totalGames: roundToDecimal(gamesCount.length),
      totalFieldGoalsMade: roundToDecimal(totalFG),
      totalFieldGoalsMissed: roundToDecimal(totalMissedFG),
      totalThreePointersMade: roundToDecimal(total3P),
      totalThreePointersMissed: roundToDecimal(totalMissed3P),
      totalFreeThrows: roundToDecimal(totalFT),
      totalMissedFreeThrows: roundToDecimal(totalMissedFT),
      totalAssists: roundToDecimal(safeSum(totals._sum.assists)),
      totalRebounds: roundToDecimal(totalRebounds),
      totalSteals: roundToDecimal(safeSum(totals._sum.steals)),
      totalBlocks: roundToDecimal(safeSum(totals._sum.blocks)),
      totalTurnovers: roundToDecimal(safeSum(totals._sum.turnovers)),
      totalPoints,
      totalOpponentPoints: roundToDecimal(totalOpponnentPoints),
      averages: {
        pointsPerGame: roundToDecimal(totalPoints / gamesCount.length),
        fieldGoalPercentage: roundToDecimal(safeSum(totalFieldGoalPercentage)),
        threePointPercentage: roundToDecimal(
          safeSum(totalThreePointPercentage),
        ),
        freeThrowPercentage: roundToDecimal(safeSum(totalFreeThrowPercentage)),
        assists: roundToDecimal(
          safeSum(totals._sum.assists) / gamesCount.length,
        ),
        rebounds: roundToDecimal(totalRebounds / gamesPlayed),
        steals: roundToDecimal(safeSum(totals._sum.steals) / gamesCount.length),
        blocks: roundToDecimal(safeSum(totals._sum.blocks) / gamesCount.length),
        turnovers: roundToDecimal(
          safeSum(totals._sum.turnovers) / gamesCount.length,
        ),
      },
      advanced: {
        offensiveRating: roundToDecimal(offensiveRating),
        trueShootingPercentage: roundToDecimal(safeSum(trueShootingPercentage)),
        assistToTurnoverRatio: roundToDecimal(safeSum(assistToTurnoverRatio)),
        netRating: roundToDecimal(safeSum(netRating)),
        effectiveFieldGoalPercentage: roundToDecimal(
          effectiveFieldGoalPercentage,
        ),
      },
    };
  }
}
