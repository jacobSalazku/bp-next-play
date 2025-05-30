import { type FC } from "react";
import { analyzeTeamStats } from "../../utils/update-stat";
import type { StatlineData } from "../../zod/player-stats";

type MobileStatsRowProps = {
  totalTeamStats: StatlineData;
};

const MobileTeamStatsRow: FC<MobileStatsRowProps> = ({ totalTeamStats }) => {
  const teamStats = analyzeTeamStats(totalTeamStats);

  return (
    <div className="mt-6 rounded-xl bg-gray-900 p-6 text-white shadow-inner">
      <h3 className="mb-4 text-xl font-semibold text-orange-300">Team Stats</h3>
      <div className="mb-2 grid grid-cols-9 gap-3 text-center text-xs font-semibold text-gray-400 sm:grid-cols-6 md:grid-cols-8">
        <div>PTS</div>
        <div>FG</div>
        <div>3PT</div>
        <div>FT</div>
        <div>REB</div>
        <div>AST</div>
        <div>STL</div>
        <div>BLK</div>
        <div>TO</div>
      </div>
      <div className="grid grid-cols-9 gap-3 text-center text-sm font-bold sm:grid-cols-6 md:grid-cols-8">
        <div>{teamStats.totalPoints}</div>
        <div>
          {teamStats.fieldGoals?.made ?? 0}/
          {teamStats.fieldGoals?.attempted ?? 0}
        </div>
        <div>
          {teamStats.threePointers?.made ?? 0}/
          {teamStats.threePointers?.attempted ?? 0}
        </div>
        <div>
          {teamStats.freeThrows?.made ?? 0}/
          {teamStats.freeThrows?.attempted ?? 0}
        </div>
        <div>{totalTeamStats.rebounds ?? 0}</div>
        <div>{totalTeamStats.assists ?? 0}</div>
        <div>{totalTeamStats.steals ?? 0}</div>
        <div>{totalTeamStats.blocks ?? 0}</div>
        <div>{totalTeamStats.turnovers ?? 0}</div>
      </div>
    </div>
  );
};

export default MobileTeamStatsRow;
