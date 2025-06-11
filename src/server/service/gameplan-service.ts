import type { GamePlanData } from "@/features/play-book/zod";
import type { Context } from "../api/trpc";
import { getPlaysById } from "./playbook-service";

export async function createGamePlan(ctx: Context, input: GamePlanData) {
  const plays = await getPlaysById(ctx, input.playsId);

  const gamePlan = await ctx.db.gamePlan.create({
    data: {
      name: input.name,
      opponent: input.opponent,
      notes: input.notes,
      activityId: input.activityId,
      createdAt: new Date(),
      teamId: input.teamId,
      plays: {
        connect: plays.map((play) => ({ id: play.id })),
      },
    },
  });

  return gamePlan;
}

export async function getGameplan(ctx: Context, teamId: string) {
  const gameplan = await ctx.db.gamePlan.findMany({
    where: {
      teamId: teamId,
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
      plays: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  });

  if (!gameplan.length) {
    return [];
  }

  return gameplan;
}

export async function deleteGamePlan(
  ctx: Context,
  gamePlanId: string,
  teamId: string,
) {
  const gamePlan = await ctx.db.gamePlan.delete({
    where: { id: gamePlanId, teamId: teamId },
  });
  return gamePlan;
}

export async function getGameplanById(ctx: Context, id: string) {
  const gameplan = await ctx.db.gamePlan.findUnique({
    where: { id: id },
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
      plays: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  });

  return gameplan;
}
