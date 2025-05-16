import { TRPCError } from "@trpc/server";
import type { Context } from "../api/trpc";
import { getUserbyId } from "./user-service";

export async function requestToJoinTeam(ctx: Context, teamId: string) {
  const { user } = await getUserbyId(ctx);

  const team = await ctx.db.team.findUnique({
    where: { code: teamId },
  });

  if (!team) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Invalid team code.",
    });
  }

  // Check if user already requested or is in the team
  const existingRequest = await ctx.db.teamMember.findFirst({
    where: { userId: user.id, teamId: team.id },
    select: { id: true, status: true },
  });

  if (existingRequest) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "You already requested or joined this team.",
    });
  }
  return ctx.db.teamMember.create({
    data: {
      userId: user.id,
      teamId: team.id,
      role: "PLAYER",
      status: "ACTIVE", // Assuming you want to set the status to pending when requesting
    },
  });
}
