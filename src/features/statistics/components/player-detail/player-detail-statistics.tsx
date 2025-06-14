"use client";

import { RotateCcw, Shield, Target, Users } from "lucide-react";
import { Suspense } from "react";
import type { PlayerStatRow } from "../../utils/types";
import { StatisticsCard } from "../stats-card";
import PlayerDetailSkeleton from "./player-detail-skeleton";
import { PlayerPerformanceChart } from "./player-performance-chart";

type PlayerDetailViewProps = {
  player: PlayerStatRow;
};

export function PlayerDetailStatistics({ player }: PlayerDetailViewProps) {
  return (
    <div className="flex max-h-screen w-full flex-col pb-20">
      <div className="scrollbar-none flex-1 overflow-y-auto">
        <div className="mx-auto mb-16 space-y-6 px-4 py-6 lg:mb-0">
          <Suspense fallback={<PlayerDetailSkeleton />}>
            <div className="space-y-4 overflow-visible py-9 text-center">
              <h1 className="font-righteous bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200 bg-clip-text text-6xl leading-tight font-bold text-transparent">
                {player.name}
              </h1>
              <p className="pt-2 text-xl font-light text-gray-400">
                Individual Performance Analysis
              </p>
              <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-300"></div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <StatisticsCard
                title="Season PPG"
                value={player.points}
                subtitle="Points per game"
                icon={Target}
              />
              <StatisticsCard
                title="Season APG"
                value={player.assists}
                subtitle="Assists per game"
                icon={Users}
              />
              <StatisticsCard
                title="Season RPG"
                value={(
                  player.defensiveRebounds + player.offensiveRebounds
                ).toFixed(1)}
                subtitle="Rebounds per game"
                icon={RotateCcw}
              />
              <StatisticsCard
                title="Season BPG"
                value={player.blocks}
                subtitle="Blocks per game"
                icon={Shield}
              />
              <StatisticsCard
                title="Season SPG"
                value={player.steals}
                subtitle="Steals per game"
                icon={Shield}
              />
            </div>
          </Suspense>
          <PlayerPerformanceChart player={player} title="Performance Trends" />
        </div>
      </div>
    </div>
  );
}
