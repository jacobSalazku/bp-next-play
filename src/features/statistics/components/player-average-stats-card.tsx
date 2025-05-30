import { Link } from "@/components/foundation/button/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/foundation/card";
import type { ColumnDef } from "@tanstack/react-table";

import { useTeam } from "@/context/team-context";
import type { PlayerStatRow } from "../utils/types";
import { PlayerAverageDataTable } from "./players-data-table";

const PlayerAveragesStatsCard = ({
  statsList,
}: {
  statsList: PlayerStatRow[];
}) => {
  const { teamSlug } = useTeam();

  const columns: ColumnDef<PlayerStatRow>[] = [
    {
      accessorKey: "name",
      header: "Player",
      cell: ({ row }) => {
        const player = row.original;
        const href = {
          pathname: `${teamSlug}/statistics/player`,
          query: { id: player.teamMemberId },
        };
        console.log("href", href);

        return (
          <Link
            href={{
              pathname: `/${teamSlug}/statistics/player`,
              query: { id: player.teamMemberId },
            }}
            className="cursor-pointer rounded-3xl font-semibold hover:text-orange-300"
          >
            {player.name}
          </Link>
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
    <Card className="w-full border-gray-800 bg-gray-950 p-2 text-2xl backdrop-blur-sm sm:p-6">
      <CardHeader className="w-full p-2">
        <CardTitle className="text-white">Player Statistics</CardTitle>
        <CardDescription className="text-gray-400">
          Click on a player name to view detailed performance analysis
        </CardDescription>
      </CardHeader>
      <div className="px-2">
        <PlayerAverageDataTable columns={columns} data={statsList} />
      </div>
    </Card>
  );
};

export { PlayerAveragesStatsCard };
