import type { Play } from "@/features/play-book/zod";
import type { GamePlan } from "@prisma/client";
import type { Context } from "../api/trpc";

export async function createPlay(
  ctx: Context,
  input: Play & { teamId: string },
) {
  const play = await ctx.db.play.create({
    data: {
      teamId: input.teamId,
      name: input.name,
      description: input.description,
      category: input.category,
      canvas: input.canvas,
      createdAt: new Date(),
    },
  });

  return play;
}

export async function deletePlay(ctx: Context, playId: string) {
  const play = await ctx.db.play.delete({
    where: { id: playId },
  });
  return play;
}

export async function getPlays(ctx: Context, teamId: string) {
  const plays = await ctx.db.play.findMany({
    where: { teamId },
    orderBy: { createdAt: "desc" },
  });

  return plays;
}

export async function createGamePlan(
  ctx: Context,
  input: GamePlan & { teamId: string },
) {
  const gamePlan = await ctx.db.gamePlan.create({
    data: {
      name: input.name,
      opponent: input.opponent,
      notes: input.notes,
      activityId: input.activityId,
    },
  });

  return gamePlan;
}

export async function getGameplan(ctx: Context, teamId: string) {
  const gameplan = await ctx.db.gamePlan.findMany({
    where: {
      activity: {
        is: { teamId: teamId },
      },
    },
    select: {
      id: true,
      name: true,
      opponent: true,
      notes: true,
      activityId: true,
      createdAt: true,
      activity: {
        select: {
          id: true,
          title: true,
          date: true,
          time: true,
        },
      },
    },
  });

  if (!gameplan) {
    throw new Error("Game plan not found");
  }

  return gameplan;
}
