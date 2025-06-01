import { getStatlineAverage } from "@/api/statline";
import { PlayerDetailStatistics } from "@/features/statistics/components/player-detail/player-detail-statistics";
import type { PlayerStatRow } from "@/features/statistics/utils/types";
import { boxScoreSearchParamsCache } from "@/utils/search-params";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ teamId: string }>;
};

async function PlayerStatisticsDetailPage({ params, searchParams }: PageProps) {
  const { teamId } = await params;
  const { id } = await boxScoreSearchParamsCache.parse(searchParams);

  const statsList = await getStatlineAverage(teamId);
  const player = statsList.find((stat) => stat.teamMemberId === id);

  if (!player) {
    return <div>Player not found.</div>;
  }

  // Map player object to PlayerStatRow structure
  const mappedPlayer: PlayerStatRow = {
    teamMemberId: player.teamMemberId,
    name: player.name ?? "",
    gamesAttended: Number(player.gamesAttended),
    averagePoints: Number(player.averages.averagePointsPerGame),
    fieldGoalPercentage: Number(player.averages.fieldGoalPercentage),
    threePointPercentage: Number(player.averages.threePointPercentage),
    freeThrowPercentage: Number(player.averages.freeThrowPercentage),
    averageOffensiveRebounds: Number(player.averages.averageOffensiveRebound),
    averageDefensiveRebounds: Number(player.averages.averageDefensiveRebound),
    averageAssists: Number(player.averages.averageAssists),
    averageSteals: Number(player.averages.averageSteals),
    averageBlocks: Number(player.averages.averageBlocks),
    averageTurnovers: Number(player.averages.averageTurnovers),
  };

  return <PlayerDetailStatistics player={mappedPlayer} />;
}

export default PlayerStatisticsDetailPage;
