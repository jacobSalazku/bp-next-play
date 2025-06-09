import { practicePrepartionSchema } from "@/features/play-book/zod";
import {
  createPracticePreparation,
  getPracticePreparation,
  getPracticePreparationById,
} from "@/server/service/practice-service";
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
  getPracticePreparationById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const practicePreparation = await getPracticePreparationById(
        ctx,
        input.id,
      );

      return practicePreparation;
    }),
});
