import type {
  opponentStatlineSchema,
  playersDataSchema,
} from "@/features/scouting/zod/player-stats";
import { ActivityType } from "@prisma/client";
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

export async function getStatlineAverages(ctx: Context, teamId: string) {
  const startOfTomorrow = new Date();
  startOfTomorrow.setHours(0, 0, 0, 0);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const teamMembers = await ctx.db.teamMember.findMany({
    where: { teamId: teamId, role: "PLAYER", status: "ACTIVE" },
    select: { id: true, user: { select: { id: true, name: true } } },
  });

  if (teamMembers.length === 0) {
    return [];
  }

  // Get activities in date range
  const activities = await ctx.db.activity.findMany({
    where: {
      type: ActivityType.GAME,
      teamId: teamId,
      date: { lte: startOfTomorrow },
    },
    select: { id: true, type: true, statlines: true },
  });

  const { activityIds, gameActivityIds } = getActivityIds(activities);

  const statlineGames = await ctx.db.statline.findMany({
    where: {
      teamMemberId: { in: teamMembers.map((m) => m.id) },
      activityId: { in: gameActivityIds },
      activity: {
        date: { lte: startOfTomorrow },
      },
    },
    select: { activityId: true, teamMemberId: true },
    distinct: ["activityId"],
  });

  if (activityIds.length === 0) {
    return teamMembers.map((member) => ({
      name: member.user.name,
      teamMemberId: member.id,
      totalPoints: 0,
      gamesAttended: 0,
      averages: {
        pointsPerGame: 0,
        fieldGoalPercentage: 0,
        threePointPercentage: 0,
        freeThrowPercentage: 0,
        assists: 0,
        offensiveRebound: 0,
        defensiveRebound: 0,
        blocks: 0,
        steals: 0,
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
          activity: {
            teamId: teamId,
            type: ActivityType.GAME,
            date: { lt: startOfTomorrow },
          },
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

      // const gamesAttended = await countGamesAttended(
      //   ctx,
      //   member.id,
      //   gameActivityIds,
      // );

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
      const numberOfGames = statlineGames.length;

      return {
        name: member.user.name,
        teamMemberId: member.id,
        totalPoints: roundToDecimal(totalPoints),
        gamesAttended: numberOfGames,
        averages: {
          pointsPerGame: roundToDecimal(
            numberOfGames === 0 ? 0 : totalPoints / numberOfGames,
          ),
          fieldGoalPercentage:
            numberOfGames === 0 ? 0 : roundToDecimal(fieldGoalPercentage),
          threePointPercentage:
            numberOfGames === 0 ? 0 : roundToDecimal(threePointPercentage),
          freeThrowPercentage:
            numberOfGames === 0 ? 0 : roundToDecimal(freeThrowPercentage),
          assists: roundToDecimal(
            numberOfGames ? (stats._sum.assists ?? 0) / numberOfGames : 0,
          ),
          offensiveRebound: roundToDecimal(
            numberOfGames
              ? (stats._sum.offensiveRebounds ?? 0) / numberOfGames
              : 0,
            1,
          ),
          defensiveRebound: roundToDecimal(
            numberOfGames
              ? (stats._sum.defensiveRebounds ?? 0) / numberOfGames
              : 0,
            0,
          ),
          blocks: roundToDecimal(
            numberOfGames ? (stats._sum.blocks ?? 0) / numberOfGames : 0,
          ),
          steals: roundToDecimal(
            numberOfGames ? (stats._sum.steals ?? 0) / numberOfGames : 0,
          ),
          turnovers: roundToDecimal(
            numberOfGames ? (stats._sum.turnovers ?? 0) / numberOfGames : 0,
          ),
        },
      };
    }),
  );
  return results;
}

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
    console.log("totalPoints", gamesCount.length);

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

export async function getGamesWithFullBoxscore(ctx: Context, teamId: string) {
  const opponentStatlines = await ctx.db.opponentStatline.findMany({
    where: {
      activity: {
        type: ActivityType.GAME,
        teamId: teamId,
      },
    },
    select: {
      activityId: true,
      name: true,
      fieldGoalsMade: true,
      threePointersMade: true,
      freeThrowsMade: true,
      activity: {
        select: {
          date: true,
          title: true,
        },
      },
    },
  });

  const statlines = await ctx.db.statline.findMany({
    where: {
      activity: {
        type: ActivityType.GAME,
        teamId: teamId,
      },
    },
    select: {
      id: true,
      teamMemberId: true,
      fieldGoalsMade: true,
      threePointersMade: true,
      freeThrows: true,
      assists: true,
      offensiveRebounds: true,
      defensiveRebounds: true,
      steals: true,
      blocks: true,
      turnovers: true,
      activityId: true,
      activity: {
        select: {
          date: true,
          title: true,
        },
      },
      teamMember: {
        select: {
          user: { select: { name: true } },
        },
      },
    },
  });

  const gamesMap = new Map<
    string,
    {
      activityId: string;
      title: string;
      date: Date;
      playerStats: typeof statlines;
      teamTotals: {
        fieldGoalsMade: number;
        threePointersMade: number;
        freeThrows: number;
        assists: number;
        offensiveRebounds: number;
        defensiveRebounds: number;
        steals: number;
        blocks: number;
        turnovers: number;
      };
      opponentName: string;
      opponentStats: {
        fieldGoalsMade: number;
        threePointersMade: number;
        freeThrowsMade: number;
      };
    }
  >();

  // Initialize with opponent info
  for (const o of opponentStatlines) {
    gamesMap.set(o.activityId, {
      activityId: o.activityId,
      title: o.activity.title,
      date: o.activity.date,
      playerStats: [],
      teamTotals: {
        fieldGoalsMade: 0,
        threePointersMade: 0,
        freeThrows: 0,
        assists: 0,
        offensiveRebounds: 0,
        defensiveRebounds: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
      },
      opponentName: o.name ?? "Opponent",
      opponentStats: {
        fieldGoalsMade: o.fieldGoalsMade ?? 0,
        threePointersMade: o.threePointersMade ?? 0,
        freeThrowsMade: o.freeThrowsMade ?? 0,
      },
    });
  }

  // Add player stats and calculate team totals per game
  for (const s of statlines) {
    if (!gamesMap.has(s.activityId)) {
      gamesMap.set(s.activityId, {
        activityId: s.activityId,
        title: s.activity.title,
        date: s.activity.date,
        playerStats: [s],
        teamTotals: {
          fieldGoalsMade: s.fieldGoalsMade ?? 0,
          threePointersMade: s.threePointersMade ?? 0,
          freeThrows: s.freeThrows ?? 0,
          assists: s.assists ?? 0,
          offensiveRebounds: s.offensiveRebounds ?? 0,
          defensiveRebounds: s.defensiveRebounds ?? 0,
          steals: s.steals ?? 0,
          blocks: s.blocks ?? 0,
          turnovers: s.turnovers ?? 0,
        },
        opponentName: "Opponent",
        opponentStats: {
          fieldGoalsMade: 0,
          threePointersMade: 0,
          freeThrowsMade: 0,
        },
      });
    } else {
      const game = gamesMap.get(s.activityId)!;
      game.playerStats.push(s);

      // Update team totals
      game.teamTotals.fieldGoalsMade += s.fieldGoalsMade ?? 0;
      game.teamTotals.threePointersMade += s.threePointersMade ?? 0;
      game.teamTotals.freeThrows += s.freeThrows ?? 0;
      game.teamTotals.assists += s.assists ?? 0;
      game.teamTotals.offensiveRebounds += s.offensiveRebounds ?? 0;
      game.teamTotals.defensiveRebounds += s.defensiveRebounds ?? 0;
      game.teamTotals.steals += s.steals ?? 0;
      game.teamTotals.blocks += s.blocks ?? 0;
      game.teamTotals.turnovers += s.turnovers ?? 0;
    }
  }

  return Array.from(gamesMap.values()).sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
}
