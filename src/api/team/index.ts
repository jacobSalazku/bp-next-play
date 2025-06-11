import "server-only";

import { api } from "@/trpc/server";
import { TeamMemberRole } from "@/types/enum";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getUser } from "../user";

export const getTeams = cache(async () => {
  const teams = await api.team.getTeams();

  if (!teams) {
    throw new Error("No teams found.");
  }
  return { teams };
});

export const getTeam = cache(async (teamId: string) => {
  const team = await api.team.getTeam({ teamId });

  return { team };
});

export const getTeamActivities = cache(async (teamId: string) => {
  const { team } = await getTeam(teamId);

  const { user } = await api.user.getUser();

  if (!user) {
    redirect("/login");
  }

  const isFirstLogin = user.createdAt === user.updatedAt;

  if (!user && isFirstLogin) {
    redirect("/create");
  }

  const activities = await api.activity.getActivities({ teamId: team.id });
  return { team, activities };
});

export const getPendingRequests = cache(async () => {
  const { teamMember } = await getUser();

  if (!teamMember) {
    throw new Error("Team member is null. Cannot fetch pending requests.");
  }
  const isCoach = (teamMember.role as TeamMemberRole) === TeamMemberRole.COACH;

  const requests = await api.team.getIncomingRequests({
    teamId: teamMember.team.id,
  });

  return { requests, isCoach };
});

export const getTeamMembers = cache(async (teamId: string) => {
  const members = await api.member.getActiveTeamMembers({ teamId });

  if (!members) {
    throw new Error("No team members found.");
  }
  return { members };
});
