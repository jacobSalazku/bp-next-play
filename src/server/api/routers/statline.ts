import { createStatlineInputSchema } from "@/features/scouting/zod/player-stats";
import {
  getGamesWithFullBoxscore,
  getStatlineAverages,
  getStatsPerGame,
  getTeamStats,
  getWeeklyTeamStatlineAverages,
  submitStatlines,
} from "@/server/service/statline-service";
import { getTeamRole } from "@/server/service/user-role-service";
import { checkCoachPermission } from "@/server/utils";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const statsRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(createStatlineInputSchema)
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
      return await submitStatlines(ctx, input, input.opponentStatline);
    }),

  getStatlineAverage: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const stats = await getStatlineAverages(ctx, input.teamId);

      return stats;
    }),

  getStatsPerGame: publicProcedure
    .input(
      z.object({
        teamMemberId: z.string(),
        year: z.number(),
        month: z.number(),
        teamId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const statPerGame = await getStatsPerGame(
        ctx,
        input.teamMemberId,
        input.teamId,
        input.year,
        input.month,
      );

      return statPerGame;
    }),

  getTeamStats: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const stats = await getTeamStats(ctx, input.teamId);

      return stats;
    }),

  getWeeklyTeamStatlineAverages: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const stats = await getWeeklyTeamStatlineAverages(ctx, input.teamId);

      if (!stats) {
        return [];
      }
      return stats;
    }),

  getGamesWithScores: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const gamesWithScores = await getGamesWithFullBoxscore(ctx, input.teamId);

      if (!gamesWithScores) {
        throw new Error("No statlines found for this game.");
      }
      return gamesWithScores;
    }),
});
