import { practicePrepartionSchema } from "@/features/play-book/zod";

import {
  createPracticePreparation,
  deletePracticePreparation,
  getPracticePreparation,
} from "@/server/service/practice-praparation-service";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { verifyCoachPermission } from "../utils/check-membership";

export const practiceRouter = createTRPCRouter({
  createPracticePreparation: protectedProcedure
    .input(practicePrepartionSchema)
    .use(async ({ ctx, input, next }) => {
      await verifyCoachPermission(ctx, input.teamId);

      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const practicePreparation = await createPracticePreparation(ctx, input);

      return practicePreparation;
    }),

  getPracticePreparation: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const practicePreparation = await getPracticePreparation(
        ctx,
        input.teamId,
      );

      return practicePreparation;
    }),

  deletePracticePreparation: protectedProcedure
    .input(z.object({ id: z.string(), teamId: z.string() }))
    .use(async ({ ctx, input, next }) => {
      await verifyCoachPermission(ctx, input.teamId);

      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const deletedPracticePreparation = await deletePracticePreparation(
        ctx,
        input.id,
      );
      return deletedPracticePreparation;
    }),
});
