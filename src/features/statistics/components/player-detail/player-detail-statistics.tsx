"use client";

import { Button } from "@/components/foundation/button/button";
import { useStatisticsStore } from "@/store/use-stats-store";
import { ChevronLeft, RotateCcw, Shield, Target, Users } from "lucide-react";
import { useStatsPerGame } from "../../hooks/use-stats-per-game";
import type { PlayerStatRow } from "../../types";
import { StatisticsCard } from "../stats-card";
import { PlayerPerformanceChart } from "./player-performance-chart";

type PlayerDetailViewProps = {
  player: PlayerStatRow;

  // timeFrame: "weekly" | "monthly";
  // onTimeFrameChange: (timeFrame: "weekly" | "monthly") => void;
  // onBack: () => void;
};

export function PlayerDetailStatistics({
  player,
  // onBack,
}: PlayerDetailViewProps) {
  //   const currentData =
  //     timeFrame === "weekly" ? player.weeklyStats : player.monthlyStats;

  const { setSelectedPlayerStatistics } = useStatisticsStore();

  const statPerGame = useStatsPerGame({ teamMemberId: player.teamMemberId });

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <Button
          variant="outline"
          onClick={() => setSelectedPlayerStatistics(null)}
          className="flex items-center gap-2 border-gray-700 bg-gray-800 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Player Stats
        </Button>

        <div className="space-y-4 text-center">
          <h1 className="bg-clip-text text-5xl font-bold text-white">
            {player.name}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <p className="text-lg text-gray-400">
              Individual Performance Analysis
            </p>
          </div>
        </div>

        {/* <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Time Frame</CardTitle>
            <CardDescription className="text-gray-400">
              Select the time period for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={timeFrame} onValueChange={onTimeFrameChange}>
              <SelectTrigger className="w-48 border-gray-700 bg-gray-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800">
                <SelectItem
                  value="weekly"
                  className="text-white hover:bg-gray-700"
                >
                  Weekly Performance
                </SelectItem>
                <SelectItem
                  value="monthly"
                  className="text-white hover:bg-gray-700"
                >
                  Monthly Performance
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card> */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatisticsCard
            title="Season PPG"
            value={player.averagePoints}
            subtitle="Points per game"
            icon={Target}
          />
          <StatisticsCard
            title="Season APG"
            value={player.averageAssists}
            subtitle="Assists per game"
            icon={Users}
          />
          <StatisticsCard
            title="Season RPG"
            value={player.averageRebounds}
            subtitle="Rebounds per game"
            icon={RotateCcw}
          />
          <StatisticsCard
            title="Season BPG"
            value={player.averageBlocks}
            subtitle="Blocks per game"
            icon={Shield}
          />
        </div>

        <PlayerPerformanceChart
          data={statPerGame[0]}
          title="Performance Trends"
          // description={`${player.name}'s ${timeFrame} performance throughout the season`}
        />

        {/* <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              {timeFrame === "weekly" ? "Weekly" : "Monthly"} Performance
              Breakdown
            </CardTitle>
            <CardDescription className="text-gray-400">
              Detailed statistics for each time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceBreakdownTable
              data={currentData}
              timeFrame={timeFrame}
            />
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
