import { gameSchema, practiceSchema } from "@/features/schedule/zod";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { checkTeamMembership } from "../utils/check-membership";

export const activityRouter = createTRPCRouter({
  createGame: protectedProcedure
    .input(
      gameSchema.extend({
        teamId: z.string(),
        type: z.literal("Game"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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
      return { success: true, activity };
    }),
  createPractice: protectedProcedure
    .input(
      practiceSchema.extend({
        teamId: z.string(),
        type: z.literal("Practice"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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
    }),

  getActivities: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      await checkTeamMembership(ctx, input.teamId);

      const activities = await ctx.db.activity.findMany({
        where: { teamId: input.teamId },
        orderBy: { date: "asc" },
      });
      return activities;
    }),
});
