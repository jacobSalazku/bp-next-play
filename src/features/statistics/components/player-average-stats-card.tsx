import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/foundation/card";
import { useStatisticsStore } from "@/store/use-stats-store";
import type { ColumnDef } from "@tanstack/react-table";
import type { PlayerStatRow } from "../types";
import { PlayerAverageDataTable } from "./players-data-table";

const PlayerAveragesStatsCard = ({
  statsList,
}: {
  statsList: PlayerStatRow[];
}) => {
  const { setSelectedPlayerStatistics } = useStatisticsStore();
  const columns: ColumnDef<PlayerStatRow>[] = [
    {
      accessorKey: "name",
      header: "Player",
      cell: ({ row }) => {
        const player = row.original;

        return (
          <span
            onClick={() => setSelectedPlayerStatistics(player)}
            className="cursor-pointer font-semibold text-orange-300 hover:underline"
          >
            {player.name}
          </span>
        );
      },
    },
    {
      accessorKey: "gamesAttended",
      header: "GP",
    },
    {
      accessorKey: "averagePoints",
      header: "Points",
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      accessorKey: "fieldGoalPercentage",
      header: "FG%",
      cell: ({ getValue }) => `${getValue<number>()}%`,
    },
    {
      accessorKey: "threePointPercentage",
      header: "3PT%",
      cell: ({ getValue }) => `${getValue<number>()}%`,
    },
    {
      accessorKey: "freeThrowPercentage",
      header: "FT%",
      cell: ({ getValue }) => `${getValue<number>()}%`,
    },
    {
      accessorKey: "averageAssists",
      header: "AST",
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      accessorKey: "averageRebounds",
      header: "RB",
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      accessorKey: "averageBlocks",
      header: "BLK",
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      accessorKey: "averageSteals",
      header: "STL",
      cell: ({ getValue }) => getValue<number>(),
    },
    {
      accessorKey: "averageTurnovers",
      header: "TO",
      cell: ({ getValue }) => getValue<number>(),
    },
  ];

  return (
    <Card className="w-full border-gray-800 bg-gray-950 p-2 text-2xl backdrop-blur-sm">
      <CardHeader className="w-full">
        <CardTitle className="text-white">Player Statistics</CardTitle>
        <CardDescription className="text-gray-400">
          Click on a player name to view detailed performance analysis
        </CardDescription>
      </CardHeader>
      <div className="px-6 md:pb-6">
        <PlayerAverageDataTable columns={columns} data={statsList} />
      </div>
    </Card>
  );
};

export { PlayerAveragesStatsCard };
