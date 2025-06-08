import type { Play } from "@/features/play-book/zod";
import type { Context } from "../api/trpc";

export async function createPlay(
  ctx: Context,
  input: Play & { teamId: string },
) {
  const play = await ctx.db.play.create({
    data: {
      teamId: input.teamId,
      name: input.name,
      description: input.description,
      category: input.category,
      canvas: input.canvas,
      createdAt: new Date(),
    },
  });

  return play;
}

export async function deletePlay(ctx: Context, playId: string, teamId: string) {
  const play = await ctx.db.play.delete({
    where: { id: playId, teamId: teamId },
  });
  return play;
}

export async function getPlays(ctx: Context, teamId: string) {
  const plays = await ctx.db.play.findMany({
    where: { teamId },
    orderBy: { createdAt: "desc" },
  });

  return plays;
}

export async function getPlaysById(
  ctx: Context,
  playsId: string[] | undefined,
) {
  if (!playsId || playsId.length === 0) {
    return [];
  }

  const plays = await ctx.db.play.findMany({
    where: { id: { in: playsId } },
  });

  return plays;
}
