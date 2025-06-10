import type { Context } from "@/server/api/trpc";
import { getActivityIds } from "@/server/api/utils/activity-id";
import {
  calculatePercentage,
  safeSum,
} from "@/server/api/utils/calculate-stats";
import { roundToDecimal } from "@/server/api/utils/round-decimal";
import { ActivityType } from "@prisma/client";

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
