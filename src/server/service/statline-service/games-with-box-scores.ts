import type { Context } from "@/server/api/trpc";
import { ActivityType } from "@prisma/client";

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
