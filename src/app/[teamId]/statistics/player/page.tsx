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
    gamesAttended: player.gamesAttended,
    points: player.averages.pointsPerGame,
    fieldGoalPercentage: player.averages.fieldGoalPercentage,
    threePointPercentage: player.averages.threePointPercentage,
    freeThrowPercentage: player.averages.freeThrowPercentage,
    offensiveRebounds: player.averages.offensiveRebound,
    defensiveRebounds: player.averages.defensiveRebound,
    assists: player.averages.assists,
    steals: player.averages.steals,
    blocks: player.averages.blocks,
    turnovers: player.averages.turnovers,
  };

  return <PlayerDetailStatistics player={mappedPlayer} />;
}

export default PlayerStatisticsDetailPage;
