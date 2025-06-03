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

export async function getPlays(ctx: Context, teamId: string): Promise<Play[]> {
  const plays = await ctx.db.play.findMany({
    where: { teamId },
    orderBy: { createdAt: "desc" },
  });

  return plays;
}
