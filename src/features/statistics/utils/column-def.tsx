import type { ColumnDef } from "@tanstack/react-table";
import type { PlayerStatRow } from "../types";

export const columns: ColumnDef<PlayerStatRow>[] = [
  {
    accessorKey: "name",
    header: "Player",
    cell: ({ getValue }) => (
      <span className="cursor-pointer font-semibold text-orange-300 hover:underline">
        {getValue<string>()}
      </span>
    ),
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
