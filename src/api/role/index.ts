import { api } from "@/trpc/server";
import { cache } from "react";

export const getRole = cache(async () => {
  const { teamMember } = await api.user.getUser();

  if (!teamMember?.team.id) {
    throw new Error("Team ID is undefined");
  }
  const { role } = await api.team.getTeamRole({ teamId: teamMember.team.id });

  return role;
});
