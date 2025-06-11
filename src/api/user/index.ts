import "server-only";

import { api } from "@/trpc/server";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUser = cache(async () => {
  try {
    const { user, teamMember } = await api.user.getUser();

    return { user, teamMember };
  } catch (error) {
    if (error instanceof TRPCError) {
      if (
        error.code === "UNAUTHORIZED" ||
        error.code === "INTERNAL_SERVER_ERROR"
      ) {
        redirect("/login");
      }
    }
    throw error;
  }
});

export const getUserById = cache(async (id: string) => {
  const { user, teamMember } = await api.user.getUserById({ userId: id });
  if (!user || !teamMember) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found.",
    });
  }
  return { user, teamMember };
});

export const getTeamMembers = cache(async (teamId: string) => {
  const members = await api.member.getTeamMembers({
    teamId: teamId,
  });

  return members;
});

export const getActiveTeamMember = cache(async (teamId: string) => {
  const team = await api.team.getTeam({ teamId });

  const members = await api.member.getActiveTeamMembers({ teamId: team.id });

  return members;
});
