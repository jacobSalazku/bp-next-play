import type { playersDataSchema } from "@/features/scouting/zod/player-stats";

import { TRPCError } from "@trpc/server";
import { type z } from "zod";
import type { Context } from "../api/trpc";
import { getActivityIds } from "../api/utils/activity-id";
import { calculatePercentage, safeSum } from "../api/utils/calculate-stats";
import { countGamesAttended } from "../api/utils/get-games-attended";

type InputSubmitStatlines = z.infer<typeof playersDataSchema>;

export async function submitStatlines(
  ctx: Context,
  input: InputSubmitStatlines,
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
        rebounds: statline.rebounds ?? 0,
        steals: statline.steals ?? 0,
        blocks: statline.blocks ?? 0,
        turnovers: statline.turnovers ?? 0,
      }));
    }),
  ).then((results) => results.flat());

  try {
    await Promise.all(
      statlinesToUpsert.map(async (statline) => {
        const existing = await ctx.db.statline.findFirst({
          where: {
            teamMemberId: statline.teamMemberId,
            activityId: statline.activityId,
          },
        });

        if (existing) {
          await ctx.db.statline.update({
            where: { id: existing.id },
            data: {
              ...statline,
              createdAt: undefined,
              updatedAt: new Date(),
            },
          });
        } else {
          await ctx.db.statline.create({
            data: {
              ...statline,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
      }),
    );

    return { success: true, count: statlinesToUpsert.length };
  } catch (error) {
    console.error("Error upserting statlines:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to save statlines",
    });
  }
}

export async function getTeamStatlineAverages(
  ctx: Context,
  input: {
    startDate: string;
    endDate: string;
    teamId: string;
  },
) {
  // 1. Get all team members
  const teamMembers = await ctx.db.teamMember.findMany({
    where: { teamId: input.teamId, role: "PLAYER", status: "ACTIVE" },
    select: { id: true, user: { select: { id: true, name: true } } },
  });

  if (teamMembers.length === 0) {
    return [];
  }

  // 2. Get activities in date range
  const activities = await ctx.db.activity.findMany({
    where: {
      date: {
        gte: input.startDate ? new Date(input.startDate) : undefined,
        lte: input.endDate ? new Date(input.endDate) : undefined,
      },
    },
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
        averagePointsPerGame: 0,
        fieldGoalPercentage: 0,
        threePointPercentage: 0,
        freeThrowPercentage: 0,
        averageAssists: 0,
        averageRebounds: 0,
        averageSteals: 0,
        averageBlocks: 0,
        averageTurnovers: 0,
      },
    }));
  }

  // 3. For each player, aggregate their stats
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
          rebounds: true,
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
        totalPoints,
        gamesAttended,
        averages: {
          averagePointsPerGame: (totalPoints / numberOfGames).toFixed(1),
          fieldGoalPercentage: fieldGoalPercentage.toFixed(1),
          threePointPercentage: threePointPercentage.toFixed(1),
          freeThrowPercentage: freeThrowPercentage.toFixed(1),
          averageAssists: ((stats._sum.assists ?? 0) / numberOfGames).toFixed(
            1,
          ),
          averageRebounds: ((stats._sum.rebounds ?? 0) / numberOfGames).toFixed(
            1,
          ),
          averageBlocks: ((stats._sum.blocks ?? 0) / numberOfGames).toFixed(1),
          averageSteals: ((stats._sum.steals ?? 0) / numberOfGames).toFixed(1),
          averageTurnovers: (
            (stats._sum.turnovers ?? 0) / numberOfGames
          ).toFixed(1),
        },
      };
    }),
  );

  return results;
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
      rebounds: true,
      steals: true,
      activity: {
        select: { date: true, title: true },
      },
    },
    orderBy: {
      activity: {
        date: "desc", // Most recent games first
      },
    },
  });

  if (!statlines || statlines.length === 0) {
    return [
      {
        gameTitle: "",
        points: 0,
        assists: 0,
        rebounds: 0,
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
      rebounds: entry.rebounds ?? 0,
      steals: entry.steals ?? 0,
    };
  });

  return statsPerGameStats;
}
