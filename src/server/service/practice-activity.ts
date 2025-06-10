import type { practiceSchema } from "@/features/schedule/zod";
import {
  type ActivityType,
  ActivityType as ActivityEnum,
} from "@prisma/client";
import type { z } from "zod";
import type { Context } from "../api/trpc";

type CreatePracticeInput = z.infer<typeof practiceSchema> & {
  teamId: string;
  type: ActivityType;
};

type EditPracticeInput = CreatePracticeInput & {
  id: string;
};

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

export async function getPractices(ctx: Context, teamId: string) {
  const practices = await ctx.db.activity.findMany({
    where: { teamId: teamId, type: ActivityEnum.PRACTICE, practice: null },
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      date: true,
      time: true,
      duration: true,
      practiceType: true,
    },
  });

  return practices;
}

export async function deletePractice(ctx: Context, activityId: string) {
  const deletedPractice = await ctx.db.activity.delete({
    where: { id: activityId },
  });
  return { success: true, activity: deletedPractice };
}
