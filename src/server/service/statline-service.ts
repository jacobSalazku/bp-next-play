import type { playersDataSchema } from "@/features/scouting/zod/player-stats";

import type { StatlineAverageResult } from "@/features/statistics/types";
import type {
  GetPlayerStatInput,
  GetPointsPerGameStatInput,
} from "@/features/statistics/zod";
import { TRPCError } from "@trpc/server";
import { type z } from "zod";
import type { Context } from "../api/trpc";

type InputSubmitStatlines = z.infer<typeof playersDataSchema>;

type StatlineEntry = {
  activity?: {
    date: Date | null;
    title: string | null;
  } | null;
} & Record<string, number>;

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

export async function getSinglePlayerStatline(
  ctx: Context,
  input: GetPlayerStatInput,
) {
  const { teamMemberId, stat } = input;

  const statlines = (await ctx.db.statline.findMany({
    where: {
      teamMemberId,
      activity: {
        date: {
          gte: new Date(input.startDate),
          lte: new Date(input.endDate ?? Date.now()),
        },
      },
    },
    select: {
      [stat]: true,
      activity: { select: { title: true, date: true } },
    },
  })) as StatlineEntry[];

  if (!statlines) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Statline not found for team member ID: ${teamMemberId}`,
    });
  }

  return statlines.map((entry) => ({
    value: entry[stat],
    date: entry.activity?.date ? entry.activity.date.toISOString() : null,
    title: entry.activity?.title ?? null,
  }));
}

export async function getStatlineAverage(
  ctx: Context,
  input: GetPointsPerGameStatInput,
): Promise<StatlineAverageResult> {
  const activities = await ctx.db.activity.findMany({
    where: {
      date: {
        gte: new Date(input.startDate),
        lte: new Date(input.endDate ?? Date.now()),
      },
    },
    select: { id: true },
  });

  const activityIds = activities.map((a) => a.id);

  if (activityIds.length === 0) {
    return {
      totalPoints: 0,
      averagePointsPerGame: 0,
      averages: {
        averagePointsPerGame: 0,
        averageFieldGoalsMade: 0,
        averageThreePointersMade: 0,
        averageFreeThrowsMade: 0,
        averageAssists: 0,
        averageRebounds: 0,
        averageSteals: 0,
        averageBlocks: 0,
        averageTurnovers: 0,
      },
    };
  }

  const stats = await ctx.db.statline.aggregate({
    where: {
      teamMemberId: input.teamMemberId,
      activityId: {
        in: activityIds,
      },
    },
    _sum: {
      fieldGoalsMade: true,
      threePointersMade: true,
      freeThrows: true,
      assists: true,
      rebounds: true,
      blocks: true,
      steals: true,
      turnovers: true,
    },
    _count: {
      id: true, // count the number of game activities
    },
  }); // Calculate total points based on sums

  const totalPoints =
    ((stats._sum.fieldGoalsMade ?? 0) - (stats._sum.threePointersMade ?? 0)) *
      2 +
    (stats._sum.threePointersMade ?? 0) * 3 +
    (stats._sum.freeThrows ?? 0);

  const numberOfGames = stats._count.id || 1; // Avoid divide by zero

  const averagePointsPerGame = totalPoints / numberOfGames;

  const averages = {
    averagePointsPerGame: totalPoints / numberOfGames,
    averageFieldGoalsMade: (stats._sum.fieldGoalsMade ?? 0) / numberOfGames,
    averageThreePointersMade:
      (stats._sum.threePointersMade ?? 0) / numberOfGames,
    averageFreeThrowsMade: (stats._sum.freeThrows ?? 0) / numberOfGames,
    averageAssists: (stats._sum.assists ?? 0) / numberOfGames,
    averageRebounds: (stats._sum.rebounds ?? 0) / numberOfGames,
    averageSteals: (stats._sum.steals ?? 0) / numberOfGames,
    averageBlocks: (stats._sum.blocks ?? 0) / numberOfGames,
    averageTurnovers: (stats._sum.turnovers ?? 0) / numberOfGames,
    // Add more stats here if needed
  };

  return {
    totalPoints,
    averagePointsPerGame,
    averages,
  };
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

  const activityIds = activities.map((a) => a.id);
  const gameActivityIds = activities
    .filter((a) => a.type === "Game")
    .map((a) => a.id);

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
        averageFieldGoalsMade: 0,
        averageThreePointersMade: 0,
        averageFreeThrowsMade: 0,
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
          threePointersMade: true,
          freeThrows: true,
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

      const gamesAttended = await ctx.db.activityAttendance.count({
        where: {
          teamMemberId: member.id,
          activityId: { in: gameActivityIds },
          attendanceStatus: "ATTENDING",
        },
      });

      const totalPoints =
        ((stats._sum.fieldGoalsMade ?? 0) -
          (stats._sum.threePointersMade ?? 0)) *
          2 +
        (stats._sum.threePointersMade ?? 0) * 3 +
        (stats._sum.freeThrows ?? 0);

      const numberOfGames = gamesAttended ?? 1;

      return {
        teamMemberId: member.id,
        name: member.user.name,
        totalPoints,
        gamesAttended,
        averages: {
          averagePointsPerGame: totalPoints / numberOfGames,
          averageFieldGoalsMade:
            (stats._sum.fieldGoalsMade ?? 0) / numberOfGames,
          averageThreePointersMade:
            (stats._sum.threePointersMade ?? 0) / numberOfGames,
          averageFreeThrowsMade: (stats._sum.freeThrows ?? 0) / numberOfGames,
          averageAssists: (stats._sum.assists ?? 0) / numberOfGames,
          averageRebounds: (stats._sum.rebounds ?? 0) / numberOfGames,
          averageSteals: (stats._sum.steals ?? 0) / numberOfGames,
          averageBlocks: (stats._sum.blocks ?? 0) / numberOfGames,
          averageTurnovers: (stats._sum.turnovers ?? 0) / numberOfGames,
        },
      };
    }),
  );

  return results;
}
