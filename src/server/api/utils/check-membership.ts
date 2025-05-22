import type { PrismaClient } from "@prisma/client";

export async function checkTeamMembership(
  ctx: { db: PrismaClient },
  teamId: string,
) {
  const isMember = await ctx.db.teamMember.findFirst({
    where: {
      teamId: teamId,
    },
  });

  if (!isMember) {
    throw new Error("You are not a member of this team.");
  }

  return isMember;
}
