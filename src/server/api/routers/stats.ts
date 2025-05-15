import { playersDataSchema } from "@/features/scouting/zod/player-stats";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const statsRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(
      playersDataSchema.extend({
        players: playersDataSchema.shape.players,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { players } = input;

      const statlinesToCreate = await Promise.all(
        players.flatMap(async (player) => {
          const teamMember = await ctx.db.teamMember.findFirst({
            where: { userId: player.id },
            select: {
              id: true,
            },
          });

          if (!teamMember) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Team member not found for player ID: ${player.id}`,
            });
          }

          return player.statlines.map((statline) => ({
            id: player.id,
            playerId: player.id,
            activityId: player.activityId,
            teamMemberId: teamMember.id,
            fieldGoalsMade: statline.fieldGoalsMade ?? 0,
            fieldGoalsMissed: statline.fieldGoalsMissed ?? 0,
            threePointersMade: statline.threePointersMade ?? 0,
            threePointersMissed: statline.threePointersMissed ?? 0,
            freeThrows: statline.freeThrows ?? 0,
            missedFreeThrows: statline.missedFreeThrows ?? 0,
            assists: statline.assists ?? 0,
            rebounds: statline.rebounds ?? 0,
            steals: statline.steals ?? 0,
            blocks: statline.blocks ?? 0,
            turnovers: statline.turnovers ?? 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
        }),
      ).then((results) => results.flat());

      try {
        const result = await ctx.db.statline.createMany({
          data: statlinesToCreate,
        });

        return { success: true, count: result.count };
      } catch (error) {
        console.error("Error creating statlines:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create statlines",
        });
      }
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
});
