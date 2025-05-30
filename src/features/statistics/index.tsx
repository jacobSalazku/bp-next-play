"use client";

import type { Statlines, TeamInformation } from "@/types";
import { PlayerAveragesStatsCard } from "./components/player-average-stats-card";
import { PerformanceComparisonChart } from "./components/player-performance-comparison-chart";
import type { PlayerStatRow } from "./utils/types";

type ChartsBlockProps = {
  statsList: Statlines;
  team: TeamInformation;
};

const StatisticsBlock: React.FC<ChartsBlockProps> = ({ statsList, team }) => {
  const data: PlayerStatRow[] = statsList.map((player) => ({
    name: player.name ?? "",
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

  const date = new Date();
  const season = date.getFullYear() - 1 + "-" + date.getFullYear();

  return (
    <div className="w-full flex-col justify-center gap-8 space-y-4 overflow-x-hidden overflow-y-auto rounded-lg px-3 py-4 md:flex md:space-y-0 md:space-x-4 lg:px-8">
      <div className="space-y-4 overflow-visible py-9 text-center">
        <h1 className="font-righteous bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200 bg-clip-text text-6xl leading-tight font-bold text-transparent">
          {team.name}
        </h1>
        <p className="pt-2 text-xl font-light text-gray-400">
          {season} Season Statistics Dashboard
        </p>
        <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-300"></div>
      </div>
      <PerformanceComparisonChart statsList={statsList} />
      <PlayerAveragesStatsCard statsList={data} />
    </div>
  );
};

export default StatisticsBlock;
