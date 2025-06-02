import { api } from "@/trpc/react";

export function useStatsPerGame({
  teamMemberId,
  year,
  month,
  teamId,
}: {
  teamMemberId: string;
  year: number;
  month: number;
  teamId: string;
}) {
  const weeklyStatsQuery = api.stats.getStatsPerGame.useSuspenseQuery({
    teamMemberId,
    year,
    month,
    teamId,
  });
  return weeklyStatsQuery;
}
