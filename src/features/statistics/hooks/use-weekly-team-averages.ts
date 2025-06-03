import { api } from "@/trpc/react";

export function useWeeklyTeamAverages({ teamId }: { teamId: string }) {
  const weeklyAverages =
    api.stats.getWeeklyTeamStatlineAverages.useSuspenseQuery({
      teamId,
    });

  return weeklyAverages;
}
