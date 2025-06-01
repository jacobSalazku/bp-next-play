"use client";

import { Tabs, TabsList } from "@/components/foundation/tabs/tab-list";
import { TabsContent } from "@/components/foundation/tabs/tabs-content";
import { TabsTrigger } from "@/components/foundation/tabs/tabs-trigger";
import type { Statlines, TeamInformation, TeamStats } from "@/types";
import { useState } from "react";
import { PlayerAveragesStatsCard } from "./components/player-average-stats-card";
import { PerformanceComparisonChart } from "./components/player-performance-comparison-chart";
import { StatisticsCard } from "./components/stats-card";
import type { PlayerStatRow } from "./utils/types";

type ChartsBlockProps = {
  teamStatlist: TeamStats;
  statsList: Statlines;
  team: TeamInformation;
};

const StatisticsBlock: React.FC<ChartsBlockProps> = ({
  statsList,
  team,
  teamStatlist,
}) => {
  const [activeTab, setActiveTab] = useState<"team" | "players">("team");
  const data: PlayerStatRow[] = statsList.map((player) => ({
    name: player.name ?? "",
    teamMemberId: player.teamMemberId,
    gamesAttended: Number(player.gamesAttended) ?? 0,
    fieldGoalPercentage: Number(player.averages.fieldGoalPercentage) ?? 0,
    threePointPercentage: Number(player.averages.threePointPercentage) ?? 0,
    freeThrowPercentage: Number(player.averages.freeThrowPercentage) ?? 0,
    averagePoints: Number(player.averages.averagePointsPerGame) ?? 0,
    averageAssists: Number(player.averages.averageAssists) ?? 0,
    averageDefensiveRebounds:
      Number(player.averages.averageDefensiveRebound) ?? 0,
    averageOffensiveRebounds:
      Number(player.averages.averageOffensiveRebound) ?? 0,
    averageBlocks: Number(player.averages.averageBlocks) ?? 0,
    averageSteals: Number(player.averages.averageSteals) ?? 0,
    averageTurnovers: Number(player.averages.averageTurnovers) ?? 0,
  }));

  const date = new Date();
  const season = date.getFullYear() - 1 + "-" + date.getFullYear();

  return (
    <div className="w-full flex-col justify-center gap-8 space-y-4 rounded-lg px-3 py-4 md:flex md:space-y-0 md:space-x-4 lg:px-8">
      <div className="space-y-4 text-center">
        <h1 className="font-righteous bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200 bg-clip-text text-6xl leading-tight font-bold text-transparent md:pt-8">
          {team.name}
        </h1>
        <p className="pt-2 text-xl font-light text-gray-400">
          {season} Season Statistics
        </p>
        <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-300"></div>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "team" | "players")}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger id="team-tab" value="team">
            Team Stats
          </TabsTrigger>
          <TabsTrigger id="players-tab" value="players">
            Player Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="team">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatisticsCard
              title="Points Per Game"
              value={teamStatlist.averages.averagePointsPerGame}
              subtitle={`Total Points: ${teamStatlist.totalPoints}`}
            />
            <StatisticsCard
              title="Field Goal Percentage"
              value={`${teamStatlist.averages.fieldGoalPercentage}%`}
            />
            <StatisticsCard
              title="3-Point %"
              value={`${teamStatlist.averages.threePointPercentage} %`}
              subtitle={`Total 3-Pointers: ${teamStatlist.totalThreePointersMade}`}
            />

            <StatisticsCard
              title="Free Throw %"
              value={`${teamStatlist.averages.freeThrowPercentage} %`}
              subtitle={`Total Free Throws Made: ${teamStatlist.totalFreeThrows}`}
            />
          </div>
        </TabsContent>
        <TabsContent value="players" className="space-y-4">
          <PerformanceComparisonChart statsList={statsList} />
          <PlayerAveragesStatsCard statsList={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatisticsBlock;
