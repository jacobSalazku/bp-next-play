import { api } from "@/trpc/server";
import { cache } from "react";

export const getStatlineAverage = cache(async (teamId: string) => {
  const statline = await api.stats.getStatlineAverage({
    teamId: teamId,
  });
  return statline;
});

export const getTeamStats = cache(async () => {
  const stats = await api.stats.getTeamStats();

  return stats;
});
