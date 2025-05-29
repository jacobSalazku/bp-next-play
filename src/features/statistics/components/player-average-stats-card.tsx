import type { Statlines } from "@/types";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/foundation/card";
import type { PlayerStatRow } from "../types";
import { columns } from "../utils/column-def";
import { PlayerAverageDataTable } from "./players-data-table";

const PlayerAveragesStatsCard = ({ statsList }: { statsList: Statlines }) => {
  const data: PlayerStatRow[] = statsList.map((player) => ({
    name: player.name ?? "",
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

  return (
    <Card className="w-full border-gray-800 bg-gray-900/50 p-2 text-2xl backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Player Statistics</CardTitle>
        <CardDescription className="text-gray-400">
          Click on a player name to view detailed performance analysis
        </CardDescription>
      </CardHeader>
      <div className="px-6">
        <PlayerAverageDataTable columns={columns} data={data} />
      </div>
    </Card>
  );
};

export { PlayerAveragesStatsCard };
