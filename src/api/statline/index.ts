import { api } from "@/trpc/server";
import { cache } from "react";

export const getStatlineAverage = cache(async (teamId: string) => {
  const statline = await api.stats.getStatlineAverage({
    teamId: teamId,
  });
  return statline;
});

export const getTeamStats = cache(async (teamId: string) => {
  const stats = await api.stats.getTeamStats({ teamId: teamId });

  return stats;
});

export const getWeeklyTeamStatlineAverages = cache(async (teamId: string) => {
  const weeklyStatline = await api.stats.getWeeklyTeamStatlineAverages({
    teamId: teamId,
  });

  return weeklyStatline;
});
