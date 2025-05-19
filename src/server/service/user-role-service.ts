import type { Context } from "../api/trpc";

export async function getTeamRole(
  ctx: Context,
  userId: string,
  teamId: string,
) {
  return ctx.db.teamMember.findFirst({
    where: { userId, teamId },
    select: {
      role: true,
    },
  });
}
