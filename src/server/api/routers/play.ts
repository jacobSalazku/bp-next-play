import { playSchema } from "@/features/play-book/zod";
import {
  createPlay,
  deletePlay,
  getPlays,
} from "@/server/service/playbook-service";
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

  deletePlay: protectedProcedure
    .input(z.object({ playId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const play = await deletePlay(ctx, input.playId);

      return play;
    }),
});
