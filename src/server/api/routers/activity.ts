import { gameSchema, practiceSchema } from "@/features/schedule/zod";
import {
  createGame,
  createPractice,
  editGame,
  editPractice,
} from "@/server/service/activity-service";
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
      const activity = createGame(ctx, input);

      return { activity, success: true };
    }),
  createPractice: protectedProcedure
    .input(
      practiceSchema.extend({
        teamId: z.string(),
        type: z.literal("Practice"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const activity = await createPractice(ctx, input);

      return { activity, success: true };
    }),
  editPractice: protectedProcedure
    .input(
      z.object(practiceSchema.shape).extend({
        id: z.string(),
        teamId: z.string(),
        type: z.literal("Practice"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedPractice = await editPractice(ctx, input);

      return { success: true, activity: updatedPractice };
    }),

  editGame: protectedProcedure
    .input(
      z.object(gameSchema.shape).extend({
        id: z.string(),
        teamId: z.string(),
        type: z.literal("Game"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedGame = await editGame(ctx, input);

      return { success: true, activity: updatedGame };
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
