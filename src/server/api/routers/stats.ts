import { statlineSchema } from "@/features/scouting/zod/player-stats";
import {
  getPlayerStatSchema,
  getPointsPerGameStatSchema,
} from "@/features/statistics/zod";
import {
  getSinglePlayerStatline,
  getStatlineAverage,
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

  getStats: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        activityId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { teamId, activityId } = input;

      const statlines = await ctx.db.statline.findMany({
        where: {
          activityId: activityId,
          teamMember: {
            teamId: teamId,
          },
        },
        include: {},
      });
      return statlines;
    }),

  getSingleStat: protectedProcedure
    .input(getPlayerStatSchema)
    .query(async ({ ctx, input }) => {
      const statline = await getSinglePlayerStatline(ctx, input);

      return statline;
    }),
  getStatlineAverage: protectedProcedure
    .input(getPointsPerGameStatSchema)
    .query(async ({ ctx, input }) => {
      const stats = await getStatlineAverage(ctx, input);

      return stats;
    }),
});
