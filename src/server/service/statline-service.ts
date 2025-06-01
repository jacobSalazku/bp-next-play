import type {
  opponentStatlineSchema,
  playersDataSchema,
} from "@/features/scouting/zod/player-stats";
import { TRPCError } from "@trpc/server";
import { type z } from "zod";
import type { Context } from "../api/trpc";
import { getActivityIds } from "../api/utils/activity-id";
import {
  calculateAssistToTurnoverRatio,
  calculateEffectiveFieldGoalPercentage,
  calculateNetRating,
  calculateOffensiveRating,
  calculatePercentage,
  calculateTotalOpponentPoints,
  calculateTrueShootingPercentage,
  safeSum,
} from "../api/utils/calculate-stats";
import { countGamesAttended } from "../api/utils/get-games-attended";
import { roundToDecimal } from "../api/utils/round-decimal";

type InputSubmitStatlines = z.infer<typeof playersDataSchema>;

export async function submitStatlines(
  ctx: Context,
  input: InputSubmitStatlines,
  opponentStatlineInput: z.infer<typeof opponentStatlineSchema> | null = null,
) {
  const { players } = input;

  const statlinesToUpsert = await Promise.all(
    players.flatMap(async (player) => {
      const teamMember = await ctx.db.teamMember.findFirst({
        where: { userId: player.id },
        select: { id: true },
      });

      if (!teamMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Team member not found for player ID: ${player.id}`,
        });
      }

      return player.statlines.map((statline) => ({
        activityId: player.activityId,
        teamMemberId: teamMember.id,
        fieldGoalsMade: statline.fieldGoalsMade ?? 0,
        fieldGoalsMissed: statline.fieldGoalsMissed ?? 0,
        threePointersMade: statline.threePointersMade ?? 0,
        threePointersMissed: statline.threePointersMissed ?? 0,
        freeThrows: statline.freeThrows ?? 0,
        missedFreeThrows: statline.missedFreeThrows ?? 0,
        assists: statline.assists ?? 0,
        offensiveRebounds: statline.offensiveRebounds ?? 0,
        defensiveRebounds: statline.defensiveRebounds ?? 0,
        steals: statline.steals ?? 0,
        blocks: statline.blocks ?? 0,
        turnovers: statline.turnovers ?? 0,
      }));
    }),
  ).then((results) => results.flat());

  let savedOpponentStatline: z.infer<typeof opponentStatlineSchema> | null =
    null;
  try {
    // $transaction to ensure both are upserter or none if an error occurs when one of them fails
    await ctx.db.$transaction(async (tx) => {
      //  Upsert opponent statline if provided
      if (opponentStatlineInput) {
        savedOpponentStatline = await tx.opponentStatline.upsert({
          where: { activityId: opponentStatlineInput.activityId },
          update: {
            ...opponentStatlineInput,
            updatedAt: new Date(),
          },
          create: {
            ...opponentStatlineInput,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      // 1. Get all existing statlines for this activity and team members in one query
      const teamMemberIds = statlinesToUpsert.map((s) => s.teamMemberId);
      const existingStatlines = await tx.statline.findMany({
        where: {
          activityId: statlinesToUpsert[0]?.activityId,
          teamMemberId: { in: teamMemberIds },
        },
      });
      const existingMap = new Map(
        existingStatlines.map((s) => [s.teamMemberId, s]),
      );

      // 3. Create an array of update and create operations (but do NOT await inside loop)
      const operations = statlinesToUpsert.map(
        (statline) => {
          const existing = existingMap.get(statline.teamMemberId);

          if (existing) {
            return tx.statline.update({
              where: { id: existing.id },
              data: {
                ...statline,
                createdAt: existing.createdAt,
                updatedAt: new Date(),
              },
            });
          } else {
            return tx.statline.create({
              data: {
                ...statline,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          }
        },
        // { timeout: 10000 },
      );

      // 4. Await all DB writes **in parallel** inside the transaction
      await Promise.all(operations);

      return {
        success: true,
        count: statlinesToUpsert.length,
        opponentStatline: savedOpponentStatline,
      };
    });
  } catch (error) {
    console.error("Error upserting statlines:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to save statlines",
    });
  }
}

export async function getStatsPerGame(
  ctx: Context,
  teamMemberId: string,
  year: number,
  month: number,
) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  // Fetch statlines for the player within the date range
  const statlines = await ctx.db.statline.findMany({
    where: {
      teamMemberId,
      activity: {
        date: {
          gte: startDate,
          lte: endDate,
        },
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
        date: "desc",
      },
    },
  });

  if (!statlines || statlines.length === 0) {
    return [
      {
        gameTitle: "",
        points: 0,
        assists: 0,
        offensiveRebounds: 0,
        defensiveRebounds: 0,
        blocks: 0,
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

export async function getTeamStatlineAverages(ctx: Context, teamId: string) {
  const teamMembers = await ctx.db.teamMember.findMany({
    where: { teamId: teamId, role: "PLAYER", status: "ACTIVE" },
    select: { id: true, user: { select: { id: true, name: true } } },
  });

  if (teamMembers.length === 0) {
    return [];
  }

  // Get activities in date range
  const activities = await ctx.db.activity.findMany({
    select: { id: true, type: true },
  });

  const { activityIds, gameActivityIds } = getActivityIds(activities);

  if (activityIds.length === 0) {
    // No games found, return zero stats for all players
    return teamMembers.map((member) => ({
      teamMemberId: member.id,
      name: member.user.name,
      totalPoints: 0,
      gamesAttended: 0,
      averagePointsPerGame: 0,
      averages: {
        pointsPerGame: 0,
        fieldGoalPercentage: 0,
        threePointPercentage: 0,
        freeThrowPercentage: 0,
        assists: 0,
        offensiveRebound: 0,
        defensiveRebound: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
      },
    }));
  }

  // For each player, aggregate their stats
  const results = await Promise.all(
    teamMembers.map(async (member) => {
      const stats = await ctx.db.statline.aggregate({
        where: {
          teamMemberId: member.id,
          activityId: {
            in: activityIds,
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
          blocks: true,
          steals: true,
          turnovers: true,
        },
        _count: {
          id: true,
        },
      });

      const gamesAttended = await countGamesAttended(
        ctx,
        member.id,
        gameActivityIds,
      );

      const madeFG = safeSum(stats._sum.fieldGoalsMade);
      const missedFG = safeSum(stats._sum.fieldGoalsMissed);

      const made3P = safeSum(stats._sum.threePointersMade);
      const missed3P = safeSum(stats._sum.threePointersMissed);

      const madeFT = safeSum(stats._sum.freeThrows);
      const missedFT = safeSum(stats._sum.missedFreeThrows);

      const fieldGoalPercentage = calculatePercentage(madeFG, missedFG);
      const threePointPercentage = calculatePercentage(made3P, missed3P);
      const freeThrowPercentage = calculatePercentage(madeFT, missedFT);

      const twoPointMade = madeFG - made3P;

      const totalPoints = twoPointMade * 2 + made3P * 3 + madeFT;
      const numberOfGames = gamesAttended ?? 1;

      return {
        name: member.user.name,
        teamMemberId: member.id,
        totalPoints: roundToDecimal(totalPoints),
        gamesAttended,
        averages: {
          pointsPerGame: roundToDecimal(totalPoints / numberOfGames),
          fieldGoalPercentage: roundToDecimal(fieldGoalPercentage),
          threePointPercentage: roundToDecimal(threePointPercentage),
          freeThrowPercentage: roundToDecimal(freeThrowPercentage),
          assists: roundToDecimal((stats._sum.assists ?? 0) / numberOfGames),
          offensiveRebound: roundToDecimal(
            (stats._sum.offensiveRebounds ?? 0) / numberOfGames,
          ),
          defensiveRebound: roundToDecimal(
            (stats._sum.defensiveRebounds ?? 0) / numberOfGames,
          ),
          blocks: roundToDecimal((stats._sum.blocks ?? 0) / numberOfGames),
          steals: roundToDecimal((stats._sum.steals ?? 0) / numberOfGames),
          turnovers: roundToDecimal(
            (stats._sum.turnovers ?? 0) / numberOfGames,
          ),
        },
      };
    }),
  );

  return results;
}

export async function getTeamStats(ctx: Context) {
  const totals = await ctx.db.statline.aggregate({
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
  const activityCount = await ctx.db.statline.findMany({
    select: {
      activity: {
        select: { date: true },
      },
    },
  });

  const opponentStatline = await ctx.db.opponentStatline.aggregate({
    _sum: {
      fieldGoalsMade: true,
      threePointersMade: true,
      freeThrowsMade: true,
    },
  });

  if (activityCount && activityCount.length > 0) {
    const uniqueGameDates = new Set(
      activityCount.map(
        (entry) => entry.activity?.date?.toISOString().split("T")[0],
      ),
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
    const totalFTAttempts = totalFT + totalMissedFG;

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

    const assistToTurnoverRation = calculateAssistToTurnoverRatio({
      assists: safeSum(totals._sum.assists),
      turonvers: safeSum(totals._sum.turnovers),
    });

    const effectiveFieldGoalPercentage = calculateEffectiveFieldGoalPercentage({
      fieldGoalsMade: totalFG,
      threePointersMade: total3P,
      fieldGoalsAttempted: totalFGAttempts,
    });

    return {
      totalGames: roundToDecimal(gamesPlayed),
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
        pointsPerGame: roundToDecimal(totalPoints / gamesPlayed),
        fieldGoalPercentage: roundToDecimal(totalFieldGoalPercentage),
        threePointPercentage: roundToDecimal(totalThreePointPercentage),
        freeThrowPercentage: roundToDecimal(totalFreeThrowPercentage),
        assists: roundToDecimal(safeSum(totals._sum.assists) / gamesPlayed),
        rebounds: roundToDecimal(totalRebounds / gamesPlayed),
        steals: roundToDecimal(safeSum(totals._sum.steals) / gamesPlayed),
        blocks: roundToDecimal(safeSum(totals._sum.blocks) / gamesPlayed),
        turnovers: roundToDecimal(safeSum(totals._sum.turnovers) / gamesPlayed),
      },
      advanced: {
        offensiveRating: roundToDecimal(offensiveRating),
        trueShootingPercentage: roundToDecimal(trueShootingPercentage),
        assistToTurnoverRatio: roundToDecimal(assistToTurnoverRation),
        netRating: roundToDecimal(netRating),
        effectiveFieldGoalPercentage: roundToDecimal(
          effectiveFieldGoalPercentage,
        ),
      },
    };
  }
}
