import { api } from "@/trpc/react";

export function useStatsPerGame({
  teamMemberId,
  year,
  month,
}: {
  teamMemberId: string;
  year: number;
  month: number;
}) {
  const weeklyStatsQuery = api.stats.getStatsPerGame.useSuspenseQuery({
    teamMemberId,
    year,
    month,
  });
  return weeklyStatsQuery;
}
