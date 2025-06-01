import type { TeamStats } from "@/types";
import { StatisticsCard } from "../stats-card";

const TeamStatsOverView = ({ teamStatlist }: { teamStatlist: TeamStats }) => {
  if (!teamStatlist) {
    return (
      <div className="text-center text-gray-500">No statistics available</div>
    );
  }

  const averages = teamStatlist.averages;
  const advanced = teamStatlist.advanced;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatisticsCard
        title="Points Per Game"
        value={averages.pointsPerGame}
        subtitle={`Total Points: ${teamStatlist.totalPoints}`}
      />
      <StatisticsCard
        title="Field Goal Percentage"
        value={`${averages.fieldGoalPercentage}%`}
      />
      <StatisticsCard
        title="3-Point %"
        value={`${averages.threePointPercentage} %`}
        subtitle={`3-PT made: ${teamStatlist.totalThreePointersMade}`}
      />
      <StatisticsCard
        title="Free Throw %"
        value={`${averages.freeThrowPercentage} %`}
        subtitle={`FT Throws Made: ${teamStatlist.totalFreeThrows}`}
      />
      <StatisticsCard
        title="Offensive Rating"
        value={advanced.offensiveRating}
      />
      <StatisticsCard
        title="True Shooting %"
        value={`${advanced.trueShootingPercentage} %`}
      />
      <StatisticsCard
        title="AST/TO Ratio"
        value={advanced.assistToTurnoverRatio}
        subtitle="counts how many assists per turnover"
      />
      <StatisticsCard
        title="Net Rating"
        value={advanced.netRating}
        subtitle="Points scored vs points allowed"
      />
    </div>
  );
};

export default TeamStatsOverView;
