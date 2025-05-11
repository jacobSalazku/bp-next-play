import { api } from "@/trpc/server";
import { TeamMemberRole } from "@/types/enum";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUser = cache(async () => {
  try {
    const { user, teamMember } = await api.user.getUser();

    if (!user) redirect("/login");

    const isFirstLogin = user.createdAt.getTime() === user.updatedAt.getTime();

    if (!teamMember && isFirstLogin) {
      redirect("/create");
    }

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

export const getTeams = cache(async () => {
  const teams = await api.team.getTeams();

  if (!teams) {
    throw new Error("No teams found.");
  }
  return { teams };
});

export const getTeamMembers = cache(async (teamId: string) => {
  const members = await api.user.getTeamMembers({
    teamId: teamId,
  });

  return members;
});

export const getPendingRequests = cache(async () => {
  const { teamMember } = await getUser();

  if (!teamMember) {
    throw new Error("Team member is null. Cannot fetch pending requests.");
  }
  const isCoach = (teamMember.role as TeamMemberRole) !== TeamMemberRole.COACH;

  const requests = await api.team.getIncomingRequests({
    teamId: teamMember.team.id,
  });

  return { requests, isCoach };
});
