import { type gameSchema } from "@/features/schedule/zod";
import {
  type ActivityType,
  ActivityType as ActivtiyEnum,
} from "@prisma/client";
import { type z } from "zod";
import type { Context } from "../api/trpc";

type CreateGameInput = z.infer<typeof gameSchema> & {
  teamId: string;
  type: ActivityType;
};

type EditGameInput = CreateGameInput & {
  id: string;
};

export async function createGame(ctx: Context, input: CreateGameInput) {
  if (!ctx.session?.user.id) {
    throw new Error("User is not Logged In");
  }

  const activity = await ctx.db.activity.create({
    data: {
      title: input.title,
      time: input.time,
      duration: input.duration,
      date: input.date,
      type: input.type,
      teamId: input.teamId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return activity;
}

export async function editGame(ctx: Context, input: EditGameInput) {
  const updatedGame = await ctx.db.activity.update({
    where: { id: input.id },
    data: {
      title: input.title,
      time: input.time,
      duration: input.duration,
      date: input.date,
      type: input.type,
      teamId: input.teamId,
      updatedAt: new Date(),
    },
  });
  return { success: true, activity: updatedGame };
}

export async function deteleGame(ctx: Context, activityId: string) {
  const deletedGame = await ctx.db.activity.delete({
    where: { id: activityId },
  });
  return { success: true, activity: deletedGame };
}

export async function getActivity(ctx: Context, activityId: string) {
  const activity = await ctx.db.activity.findUnique({
    where: { id: activityId },
    select: {
      id: true,
      title: true,
      date: true,
      time: true,
      duration: true,
      type: true,
      practiceType: true,
      createdAt: true,
      updatedAt: true,
      attendees: {
        select: {
          teamMemberId: true,
          attendanceStatus: true,
          reason: true,
        },
      },
      opponentStatline: {
        select: {
          name: true,
          fieldGoalsMade: true,
          threePointersMade: true,
          freeThrowsMade: true,
          activityId: true,
        },
      },
    },
  });

  if (!activity) {
    throw new Error("Activity not found");
  }
  return activity;
}

export async function getGames(ctx: Context, teamId: string) {
  const games = await ctx.db.activity.findMany({
    where: { teamId: teamId, type: ActivtiyEnum.GAME, gamePlan: null },
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      date: true,
      time: true,
      duration: true,
    },
  });

  return games;
}
