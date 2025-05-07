import { api } from "@/trpc/server";
import { cache } from "react";

export const getTeamAndActivities = cache(async () => {
  const team = await api.team.getTeam();
  const activities = await api.activity.getActivities({ teamId: team.id });
  return { team, activities };
});
