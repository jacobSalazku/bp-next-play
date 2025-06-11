import { getStatlineAverage } from "@/api/statline";
import PlayerDetailSkeleton from "@/features/statistics/components/player-detail/player-detail-skeleton";
import { PlayerDetailStatistics } from "@/features/statistics/components/player-detail/player-detail-statistics";
import type { PlayerStatRow } from "@/features/statistics/utils/types";
import { boxScoreSearchParamsCache } from "@/utils/search-params";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ teamId: string }>;
};

async function PlayerStatisticsDetailPage({ params, searchParams }: PageProps) {
  const { teamId } = await params;
  const { id } = await boxScoreSearchParamsCache.parse(searchParams);

  const statsList = await getStatlineAverage(teamId);
  const player = statsList?.find((stat) => stat.teamMemberId === id);

  if (!player) {
    return notFound();
  }

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

  return (
    <Suspense fallback={<PlayerDetailSkeleton />}>
      <PlayerDetailStatistics player={mappedPlayer} />
    </Suspense>
  );
}

export default PlayerStatisticsDetailPage;
