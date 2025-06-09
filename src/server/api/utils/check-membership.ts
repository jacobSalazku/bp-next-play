import { getTeamRole } from "@/server/service/user-role-service";
import { checkCoachPermission } from "@/server/utils";
import type { PrismaClient } from "@prisma/client";
import type { Context } from "../trpc";

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

export async function verifyCoachPermission(ctx: Context, teamId: string) {
  if (!ctx.session || !ctx.session.user) {
    throw new Error("User session not found.");
  }
  const role = await getTeamRole(ctx, ctx.session.user.id, teamId);

  if (!role || (role.role !== "COACH" && role.role !== "PLAYER")) {
    throw new Error("User role not found or invalid.");
  }
  if (role.role === "PLAYER") {
    throw new Error("You do not have permission to delete this game plan.");
  }
  await checkCoachPermission(role.role);
}
