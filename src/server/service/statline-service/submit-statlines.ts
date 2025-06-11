import type {
  opponentStatlineSchema,
  playersDataSchema,
} from "@/features/scouting/zod/player-stats";
import type { Context } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type { z } from "zod";

type InputSubmitStatlines = z.infer<typeof playersDataSchema>;

export async function submitStatlines(
  ctx: Context,
  input: InputSubmitStatlines,
  opponentStatlineInput: z.infer<typeof opponentStatlineSchema> | null = null,
) {
  const { players } = input;

  const statlinesToUpsert = await Promise.all(
    players.flatMap(async (player) => {
      const teamMember = await ctx.db.teamMember.findFirst({
        where: { userId: player.id },
        select: { id: true },
      });

      if (!teamMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Team member not found for player ID: ${player.id}`,
        });
      }

      return player.statlines.map((statline) => ({
        activityId: player.activityId,
        teamMemberId: teamMember.id,
        fieldGoalsMade: statline.fieldGoalsMade ?? 0,
        fieldGoalsMissed: statline.fieldGoalsMissed ?? 0,
        threePointersMade: statline.threePointersMade ?? 0,
        threePointersMissed: statline.threePointersMissed ?? 0,
        freeThrows: statline.freeThrows ?? 0,
        missedFreeThrows: statline.missedFreeThrows ?? 0,
        assists: statline.assists ?? 0,
        offensiveRebounds: statline.offensiveRebounds ?? 0,
        defensiveRebounds: statline.defensiveRebounds ?? 0,
        steals: statline.steals ?? 0,
        blocks: statline.blocks ?? 0,
        turnovers: statline.turnovers ?? 0,
      }));
    }),
  ).then((results) => results.flat());

  let savedOpponentStatline: z.infer<typeof opponentStatlineSchema> | null =
    null;
  try {
    // $transaction to ensure both are upserter or none if an error occurs when one of them fails
    await ctx.db.$transaction(async (tx) => {
      //  Upsert opponent statline if provided
      if (opponentStatlineInput) {
        savedOpponentStatline = await tx.opponentStatline.upsert({
          where: { activityId: opponentStatlineInput.activityId },
          update: {
            ...opponentStatlineInput,
            updatedAt: new Date(),
          },
          create: {
            ...opponentStatlineInput,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      // 1. Get all existing statlines for this activity and team members in one query
      const teamMemberIds = statlinesToUpsert.map((s) => s.teamMemberId);
      const existingStatlines = await tx.statline.findMany({
        where: {
          activityId: statlinesToUpsert[0]?.activityId,
          teamMemberId: { in: teamMemberIds },
        },
      });
      const existingMap = new Map(
        existingStatlines.map((s) => [s.teamMemberId, s]),
      );

      // 3. Create an array of update and create operations (but do NOT await inside loop)
      const operations = statlinesToUpsert.map(
        (statline) => {
          const existing = existingMap.get(statline.teamMemberId);

          if (existing) {
            return tx.statline.update({
              where: { id: existing.id },
              data: {
                ...statline,
                createdAt: existing.createdAt,
                updatedAt: new Date(),
              },
            });
          } else {
            return tx.statline.create({
              data: {
                ...statline,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          }
        },
        // { timeout: 10000 },
      );

      // 4. Await all DB writes **in parallel** inside the transaction
      await Promise.all(operations);

      return {
        success: true,
        count: statlinesToUpsert.length,
        opponentStatline: savedOpponentStatline,
      };
    });
  } catch (error) {
    console.error("Error upserting statlines:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to save statlines",
    });
  }
}
