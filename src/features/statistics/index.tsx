"use client";

import { useStatisticsStore } from "@/store/use-stats-store";
import type { Statlines } from "@/types";
import { PlayerAveragesStatsCard } from "./components/player-average-stats-card";
import { PlayerDetailStatistics } from "./components/player-detail/player-detail-statistics";
import { PerformanceComparisonChart } from "./components/player-performance-comparison-chart";
import type { PlayerStatRow } from "./types";

type ChartsBlockProps = {
  statsList: Statlines;
};

const StatisticsBlock: React.FC<ChartsBlockProps> = ({ statsList }) => {
  const { selectedPlayerStatistics } = useStatisticsStore();

  const data: PlayerStatRow[] = statsList.map((player) => ({
    name: player.name ?? "", // Use the player's name as a string
    teamMemberId: player.teamMemberId,
    gamesAttended: Number(player.gamesAttended) ?? 0,
    fieldGoalPercentage: Number(player.averages.fieldGoalPercentage) ?? 0,
    threePointPercentage: Number(player.averages.threePointPercentage) ?? 0,
    freeThrowPercentage: Number(player.averages.freeThrowPercentage) ?? 0,
    averagePoints: Number(player.averages.averagePointsPerGame) ?? 0,
    averageAssists: Number(player.averages.averageAssists) ?? 0,
    averageRebounds: Number(player.averages.averageRebounds) ?? 0,
    averageBlocks: Number(player.averages.averageBlocks) ?? 0,
    averageSteals: Number(player.averages.averageSteals) ?? 0,
    averageTurnovers: Number(player.averages.averageTurnovers) ?? 0,
  }));

  if (selectedPlayerStatistics) {
    return <PlayerDetailStatistics player={selectedPlayerStatistics} />;
  }

  return (
    <div className="w-full flex-col justify-center gap-8 space-y-4 overflow-x-hidden overflow-y-auto rounded-lg px-3 py-4 md:flex md:space-y-0 md:space-x-4 lg:px-8">
      <PerformanceComparisonChart statsList={statsList} />
      <PlayerAveragesStatsCard statsList={data} />
    </div>
  );
};

export default StatisticsBlock;
