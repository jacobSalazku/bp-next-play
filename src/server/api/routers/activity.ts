import { gameSchema, practiceSchema } from "@/features/schedule/zod";
import {
  createGame,
  createPractice,
  editGame,
  editPractice,
  getActivity,
  getGames,
  getPractices,
} from "@/server/service/activity-service";
import { ActivityType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  checkTeamMembership,
  verifyCoachPermission,
} from "../utils/check-membership";

export const activityRouter = createTRPCRouter({
  createGame: protectedProcedure
    .input(
      gameSchema.extend({
        teamId: z.string(),
        type: z
          .nativeEnum(ActivityType)
          .refine((val) => val === ActivityType.GAME, {
            message: `Activity type must be ${ActivityType.GAME}`,
          }),
      }),
    )
    .use(async ({ ctx, input, next }) => {
      await verifyCoachPermission(ctx, input.teamId);
      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const activity = await createGame(ctx, input);

      return activity;
    }),

  createPractice: protectedProcedure
    .input(
      practiceSchema.extend({
        teamId: z.string(),
        type: z
          .nativeEnum(ActivityType)
          .refine((val) => val === ActivityType.PRACTICE, {
            message: `Activity type must be ${ActivityType.PRACTICE}`,
          }),
      }),
    )
    .use(async ({ ctx, input, next }) => {
      await verifyCoachPermission(ctx, input.teamId);
      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const activity = await createPractice(ctx, input);

      return activity;
    }),

  editPractice: protectedProcedure
    .input(
      z.object(practiceSchema.shape).extend({
        id: z.string(),
        teamId: z.string(),
        type: z
          .nativeEnum(ActivityType)
          .refine((val) => val === ActivityType.PRACTICE, {
            message: `Activity type must be ${ActivityType.PRACTICE}`,
          }),
      }),
    )
    .use(async ({ ctx, input, next }) => {
      await verifyCoachPermission(ctx, input.teamId);
      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const updatedPractice = await editPractice(ctx, input);

      return updatedPractice;
    }),

  editGame: protectedProcedure
    .input(
      z.object(gameSchema.shape).extend({
        id: z.string(),
        teamId: z.string(),
        type: z
          .nativeEnum(ActivityType)
          .refine((val) => val === ActivityType.GAME, {
            message: `Activity type must be ${ActivityType.GAME}`,
          }),
      }),
    )
    .use(async ({ ctx, input, next }) => {
      await verifyCoachPermission(ctx, input.teamId);

      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const updatedGame = await editGame(ctx, input);

      return updatedGame;
    }),

  getActivities: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      await checkTeamMembership(ctx, input.teamId);

      const activities = await ctx.db.activity.findMany({
        where: { teamId: input.teamId },
        orderBy: { date: "asc" },
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
        },
      });

      return activities;
    }),

  getActivity: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .query(async ({ ctx, input }) => {
      const activity = await getActivity(ctx, input.activityId);

      return activity;
    }),

  getGames: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const games = await getGames(ctx, input.teamId);

      return games;
    }),

  getPractices: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const practices = await getPractices(ctx, input.teamId);

      return practices;
    }),
});
