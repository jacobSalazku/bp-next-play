import { playSchema } from "@/features/play-book/zod";
import { createPlay, getPlays } from "@/server/service/playbook-service";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const playRouter = createTRPCRouter({
  createPlay: protectedProcedure
    .input(
      playSchema.extend({
        teamId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const play = await createPlay(ctx, input);

      return play;
    }),
  getAllPlays: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const plays = await getPlays(ctx, input.teamId);

      return plays;
    }),
});
