import { api } from "@/trpc/server";
import { cache } from "react";

export const getTeamMember = cache(async () => {
  const team = await api.team.getTeam();
  const { members } = await api.team.getTeamMembers({ teamId: team.id });
  return { members };
});
