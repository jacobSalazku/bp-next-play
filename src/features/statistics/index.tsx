"use client";

import type { Statlines } from "@/types";
import { PlayerAveragesStatsCard } from "./components/player-average-stats-card";
import { PerformanceComparisonChart } from "./components/player-performance-comparison-chart";

type ChartsBlockProps = {
  statsList: Statlines;
};

const StatisticsBlock: React.FC<ChartsBlockProps> = ({ statsList }) => {
  return (
    <div className="w-full flex-col justify-center gap-8 space-y-4 rounded-lg px-8 py-4 md:flex md:space-y-0 md:space-x-4">
      <PerformanceComparisonChart statsList={statsList} />
      <PlayerAveragesStatsCard statsList={statsList} />
    </div>
  );
};

export default StatisticsBlock;
