"use client";

import type { TeamStats } from "@/types";

import { StatisticsCard } from "../stats-card";

const TeamStatsOverViewCharts = ({
  teamStatlist,
}: {
  teamStatlist: TeamStats;
}) => {
  const averages = teamStatlist?.averages;
  const advanced = teamStatlist?.advanced;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <>
        <StatisticsCard
          title="Points Per Game"
          value={averages?.pointsPerGame ?? "0"}
          subtitle={`Total Points: ${teamStatlist?.totalPoints ?? 0}`}
        />
        <StatisticsCard
          title="Field Goal Percentage"
          value={`${averages?.fieldGoalPercentage ?? "0"}%`}
        />
        <StatisticsCard
          title="3-Point %"
          value={`${averages?.threePointPercentage ?? "0"} %`}
          subtitle={`3-PT made: ${averages?.threePointPercentage ?? 0}`}
        />
        <StatisticsCard
          title="Free Throw %"
          value={`${averages?.freeThrowPercentage ?? "0"} %`}
          subtitle={`FT Throws Made: ${averages?.freeThrowPercentage ?? 0}`}
        />
        <StatisticsCard
          title="Offensive Rating"
          value={advanced?.offensiveRating ?? "0"}
        />
        <StatisticsCard
          title="True Shooting %"
          value={`${advanced?.trueShootingPercentage ?? "0"} %`}
        />
        <StatisticsCard
          title="AST/TO Ratio"
          value={Number(advanced?.assistToTurnoverRatio) ?? "0"}
          subtitle="counts how many assists per turnover"
        />
        <StatisticsCard
          title="Net Rating"
          value={advanced?.netRating ?? "0"}
          subtitle="Points scored vs points allowed"
        />
      </>
    </div>
  );
};

export default TeamStatsOverViewCharts;
