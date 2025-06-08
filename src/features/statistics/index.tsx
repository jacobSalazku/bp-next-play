"use client";

import { Tabs, TabsList } from "@/components/foundation/tabs/tab-list";
import { TabsContent } from "@/components/foundation/tabs/tabs-content";
import { TabsTrigger } from "@/components/foundation/tabs/tabs-trigger";
import type { Statlines, TeamInformation, TeamStats } from "@/types";
import { cn } from "@/utils/tw-merge";
import { BarChart3, TrendingUp } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { PlayerAveragesStatsCard } from "./components/player-average-stats-card";
import { PerformanceComparisonChart } from "./components/player-performance-comparison-chart";
import TeamPerfomanceChart from "./components/team/team-performance-chart";
import TeamStatsOverView from "./components/team/team-stats-overview";
import type { PlayerStatRow } from "./utils/types";

type TabType = "team" | "players";

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
  const [activeTab, setActiveTab] = useState<TabType>("team");

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value as TabType);
    },
    [setActiveTab],
  );

  const data: PlayerStatRow[] = useMemo(() => {
    return statsList.map((player) => ({
      name: player.name ?? "",
      teamMemberId: player.teamMemberId,
      gamesAttended: player.gamesAttended ?? 0,
      fieldGoalPercentage: player.averages.fieldGoalPercentage ?? 0,
      threePointPercentage: player.averages.threePointPercentage ?? 0,
      freeThrowPercentage: player.averages.freeThrowPercentage ?? 0,
      points: player.averages.pointsPerGame ?? 0,
      assists: player.averages.assists ?? 0,
      defensiveRebounds: player.averages.defensiveRebound ?? 0,
      offensiveRebounds: player.averages.offensiveRebound ?? 0,
      blocks: player.averages.blocks ?? 0,
      steals: player.averages.steals ?? 0,
      turnovers: player.averages.turnovers ?? 0,
    }));
  }, [statsList]);

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
        onValueChange={handleTabChange}
        className="flex w-full gap-12"
      >
        <TabsList className="flex w-full gap-4 pt-8 lg:pt-16">
          <TabsTrigger
            id="team-tab"
            value="team"
            className={cn(
              "group flex w-1/2 flex-1 items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 px-6 py-3 text-left transition-colors duration-500 ease-in-out",
              "data-[state=active]:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400",
            )}
          >
            <TrendingUp className="hidden h-12 w-12 rounded-lg bg-gray-300/20 p-2 sm:block" />
            <div className="flex flex-col transition-colors duration-300 ease-in-out">
              <p className="text-base font-semibold">Team Stats</p>
              <span className="text-sm text-gray-100/80">
                Overall Performance
              </span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            id="players-tab"
            value="players"
            className={cn(
              "group flex w-1/2 flex-1 items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 px-6 py-3 text-left transition-colors duration-500 ease-in-out",
              "data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400",
            )}
          >
            <BarChart3 className="hidden h-12 w-12 rounded-lg bg-gray-300/20 p-2 sm:block" />
            <div className="flex flex-col transition-colors duration-300 ease-in-out">
              <p className="text-base font-semibold">Player Stats</p>
              <span className="text-sm text-gray-100/80">
                Individual Breakdown
              </span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="team" className="space-y-4 py-4">
          <TeamStatsOverView teamStatlist={teamStatlist} />
          <TeamPerfomanceChart title="Monthly Performance Trends" />
        </TabsContent>
        <TabsContent value="players" className="space-y-4 py-4">
          <PerformanceComparisonChart statsList={statsList} />
          <PlayerAveragesStatsCard statsList={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatisticsBlock;
