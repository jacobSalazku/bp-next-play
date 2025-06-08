import { gamePlanSchema } from "@/features/play-book/zod";
import {
  createGamePlan,
  deleteGamePlan,
  getGameplan,
} from "@/server/service/gameplan-service";
import { getTeamRole } from "@/server/service/user-role-service";
import { checkCoachPermission } from "@/server/utils";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const gameplanRouter = createTRPCRouter({
  createGamePlan: protectedProcedure
    .input(
      gamePlanSchema.extend({
        id: z.string(),
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
      const gamePlan = await createGamePlan(ctx, {
        ...input,
        teamId: input.teamId,
        opponent: input.opponent ?? null,
        notes: input.notes ?? null,
      });

      return gamePlan;
    }),

  getGameplan: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const gameplan = await getGameplan(ctx, input.teamId);

      return gameplan;
    }),

  deleteGamePlan: protectedProcedure
    .input(z.object({ gamePlanId: z.string(), teamId: z.string() }))
    .use(async ({ ctx, input, next }) => {
      const role = await getTeamRole(ctx, ctx.session.user.id, input.teamId);
      if (!role || (role.role !== "COACH" && role.role !== "PLAYER")) {
        throw new Error("User role not found or invalid.");
      }
      if (role.role === "PLAYER") {
        throw new Error("You do not have permission to delete this game plan.");
      }
      await checkCoachPermission(role.role);
      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const gamePlan = await deleteGamePlan(
        ctx,
        input.gamePlanId,
        input.teamId,
      );

      return gamePlan;
    }),
});
