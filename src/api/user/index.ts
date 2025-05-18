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

export const getTeamMembers = cache(async (teamId: string) => {
  const members = await api.user.getTeamMembers({
    teamId: teamId,
  });

  return members;
});

export const getTeamMember = cache(async (teamId: string) => {
  const team = await api.team.getTeam({ teamId });

  const members = await api.team.getTeamMembers({ teamId: team.id });

  return members;
});
