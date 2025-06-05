import { type gameSchema, type practiceSchema } from "@/features/schedule/zod";
import { type z } from "zod";
import type { Context } from "../api/trpc";

type CreateGameInput = z.infer<typeof gameSchema> & {
  teamId: string;
  type: "Game";
};

type EditPracticeInput = CreatePracticeInput & {
  id: string;
};

type CreatePracticeInput = z.infer<typeof practiceSchema> & {
  teamId: string;
  type: "Practice";
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

export async function createPractice(ctx: Context, input: CreatePracticeInput) {
  const activity = await ctx.db.activity.create({
    data: {
      title: input.title,
      time: input.time,
      duration: input.duration,
      date: input.date,
      type: input.type,
      practiceType: input.practiceType,
      teamId: input.teamId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return { success: true, activity };
}

export async function editPractice(ctx: Context, input: EditPracticeInput) {
  const updatedPractice = await ctx.db.activity.update({
    where: { id: input.id },
    data: {
      title: input.title,
      time: input.time,
      duration: input.duration,
      date: input.date,
      type: input.type,
      practiceType: input.practiceType,
      teamId: input.teamId,
      updatedAt: new Date(),
    },
  });
  return { success: true, activity: updatedPractice };
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
    where: { teamId: teamId, type: "Game" },
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
