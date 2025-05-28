import { gameSchema, practiceSchema } from "@/features/schedule/zod";
import {
  createGame,
  createPractice,
  editGame,
  editPractice,
} from "@/server/service/activity-service";
import { getTeamRole } from "@/server/service/user-role-service";
import { checkCoachPermission } from "@/server/utils";
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
    .use(async ({ ctx, input, next }) => {
      const role = await getTeamRole(ctx, ctx.session.user.id, input.teamId);

      if (!role || (role.role !== "COACH" && role.role !== "PLAYER")) {
        throw new Error("User role not found or invalid.");
      }

      await checkCoachPermission(role.role);

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
        type: z.literal("Practice"),
      }),
    )
    .use(async ({ ctx, input, next }) => {
      const role = await getTeamRole(ctx, ctx.session.user.id, input.teamId);
      if (!role || (role.role !== "COACH" && role.role !== "PLAYER")) {
        throw new Error("User role not found or invalid.");
      }
      if (role.role === "PLAYER")
        throw new Error("You do not have permission to edit this activity.");

      await checkCoachPermission(role.role);
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
        type: z.literal("Practice"),
      }),
    )
    .use(async ({ ctx, input, next }) => {
      const role = await getTeamRole(ctx, ctx.session.user.id, input.teamId);
      if (!role || (role.role !== "COACH" && role.role !== "PLAYER")) {
        throw new Error("User role not found or invalid.");
      }
      if (role.role === "PLAYER") {
        throw new Error("You do not have permission to edit this activity.");
      }
      await checkCoachPermission(role.role);
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
        type: z.literal("Game"),
      }),
    )
    .use(async ({ ctx, input, next }) => {
      const role = await getTeamRole(ctx, ctx.session.user.id, input.teamId);
      if (!role || (role.role !== "COACH" && role.role !== "PLAYER")) {
        throw new Error("User role not found or invalid.");
      }
      if (role.role === "PLAYER") {
        throw new Error("You do not have permission to edit this activity.");
      }
      await checkCoachPermission(role.role);
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
});
