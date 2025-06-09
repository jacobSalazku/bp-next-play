import { gamePlanSchema } from "@/features/play-book/zod";
import {
  createGamePlan,
  deleteGamePlan,
  getGameplan,
  getGameplanById,
} from "@/server/service/gameplan-service";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { verifyCoachPermission } from "../utils/check-membership";

export const gameplanRouter = createTRPCRouter({
  createGamePlan: protectedProcedure
    .input(
      gamePlanSchema.extend({
        id: z.string(),
      }),
    )
    .use(async ({ ctx, input, next }) => {
      await verifyCoachPermission(ctx, input.teamId);

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
      await verifyCoachPermission(ctx, input.teamId);

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

  getGamePlanById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const gameplan = await getGameplanById(ctx, input.id);

      return gameplan;
    }),
});
