import { api } from "@/trpc/react";

export function useStatsPerGame({ teamMemberId }: { teamMemberId: string }) {
  const weeklyStatsQuery = api.stats.getStatsPerGame.useSuspenseQuery({
    teamMemberId,
  });
  return weeklyStatsQuery;
}
