import { statlineSchema } from "@/features/scouting/zod/player-stats";
import { getPlayerStatSchema } from "@/features/statistics/zod";
import {
  getSinglePlayerStatline,
  getStatsPerGame,
  getTeamStatlineAverages,
  submitStatlines,
} from "@/server/service/statline-service";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const statsRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(
      z.object({
        players: z.array(
          z.object({
            id: z.string(),
            activityId: z.string(),
            statlines: z.array(statlineSchema),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await submitStatlines(ctx, input);
    }),

  getSingleStat: protectedProcedure
    .input(getPlayerStatSchema)
    .query(async ({ ctx, input }) => {
      const statline = await getSinglePlayerStatline(ctx, input);

      return statline;
    }),

  getStatlineAverage: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const stats = await getTeamStatlineAverages(ctx, input);

      return stats;
    }),

  getStatsPerGame: protectedProcedure
    .input(
      z.object({
        teamMemberId: z.string(),
        year: z.number(),
        month: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const statPerGame = await getStatsPerGame(
        ctx,
        input.teamMemberId,
        input.year,
        input.month,
      );

      return statPerGame;
    }),
});
