import type { PracticePreparationData } from "@/features/play-book/zod";
import type { Context } from "../api/trpc";
import { getPlaysById } from "./playbook-service";

export async function createPracticePreparation(
  ctx: Context,
  input: PracticePreparationData,
) {
  const plays = await getPlaysById(ctx, input.playsId);

  const practicePreparation = await ctx.db.practicePreparation.create({
    data: {
      activityId: input.activityId,
      plays: {
        connect: plays.map((play) => ({ id: play.id })),
      },
      teamId: input.teamId,
      name: input.name,
      focus: input.focus,
      notes: input.notes,
      createdAt: new Date(),
    },
  });

  return practicePreparation;
}

export async function getPracticePreparation(ctx: Context, teamId: string) {
  const practicePreparation = await ctx.db.practicePreparation.findMany({
    where: {
      teamId: teamId,
    },
    select: {
      id: true,
      name: true,
      focus: true,
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

  if (!practicePreparation.length) {
    return [];
  }

  return practicePreparation;
}

export async function getPracticePreparationById(ctx: Context, id: string) {
  const practicePreparation = await ctx.db.practicePreparation.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      focus: true,
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

  if (!practicePreparation) {
    throw new Error("Practice preparation not found");
  }

  return practicePreparation;
}
