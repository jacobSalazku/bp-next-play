"use client";
import { Button } from "@/components/button/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TeamMember } from "@/types";
import { useState, type FC } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { StatlineData } from "../zod/player-stats";
import { PlayerStatsRow } from "./player-stat-row";

export type PlayerWithStats = TeamMember & {
  statlines: StatlineData[];
};

export type PlayersData = {
  players: PlayerWithStats[];
};
const defaultStatline: StatlineData = {
  fieldGoalsMade: 0,
  fieldGoalsMissed: 0,
  threePointersMade: 0,
  threePointersMissed: 0,
  freeThrows: 0,
  missedFreeThrows: 0,
  assists: 0,
  steals: 0,
  turnovers: 0,
  rebounds: 0,
  blocks: 0,
};

const PlayerBoxScore: FC<PlayersData> = ({ players }) => {
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const { control, setValue, handleSubmit } = useForm<PlayersData>({
    defaultValues: {
      players: players.map((player) => ({
        ...player,
        statlines: player.statlines.map((statline) => ({
          ...defaultStatline,
          id: statline.id,
        })),
      })),
    },
  });

  const stats = useWatch({ control });

  if (!stats) return null;

  const handleChange = (
    playerIndex: number,
    field: keyof StatlineData,
    amount: number,
  ) => {
    const current = stats.players?.[playerIndex]?.statlines?.[0]?.[field] ?? 0;
    setValue(
      `players.${playerIndex}.statlines.0.${field}` as const,
      Math.max(0, Number(current) + amount),
    );
  };

  const statRows: { key: keyof StatlineData; label: string }[] = [
    { key: "fieldGoalsMade", label: "FGM" },
    { key: "fieldGoalsMissed", label: "FG Missed" },
    { key: "threePointersMade", label: "3PM" },
    { key: "threePointersMissed", label: "3P Missed" },
    { key: "freeThrows", label: "FTM" },
    { key: "missedFreeThrows", label: "FT Missed" },
    { key: "rebounds", label: "REB" },
    { key: "assists", label: "AST" },
    { key: "steals", label: "STL" },
    { key: "blocks", label: "BLK" },
    { key: "turnovers", label: "TO" },
  ];

  return (
    <div className="mx-auto h-full w-full max-w-5xl p-4">
      <h2 className="mb-6 text-xl font-bold text-gray-200 sm:text-2xl md:text-3xl">
        Player Box Score
      </h2>
      <div className="flex w-full min-w-full flex-col md:min-h-1/2">
        <Table className="rounded-lg border shadow-md">
          <TableHeader>
            <TableRow className="bg-gray-200 font-semibold text-gray-600 uppercase">
              <TableHead className="p-3 text-left">Name</TableHead>
              <TableHead className="p-3 text-center">FG</TableHead>
              <TableHead className="p-3 text-center">3Pt</TableHead>
              <TableHead className="p-3 text-center">FT</TableHead>
              <TableHead className="p-3 text-center">REB</TableHead>
              <TableHead className="p-3 text-center">AST</TableHead>
              <TableHead className="p-3 text-center">STL</TableHead>
              <TableHead className="p-3 text-center">BLK</TableHead>
              <TableHead className="p-3 text-center">TO</TableHead>
              <TableHead className="p-3 text-center">PTS</TableHead>
              <TableHead className="p-3 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => {
              return (
                <PlayerStatsRow
                  key={index}
                  player={player}
                  index={index}
                  statsForPlayer={{
                    ...defaultStatline,
                    ...(stats.players?.[index]?.statlines?.[0] ?? {}),
                  }}
                  activePlayerIndex={activePlayerIndex}
                  setActivePlayerIndex={setActivePlayerIndex}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
        {statRows.map(({ key, label }) => (
          // <div
          //   key={key}
          // //  className="flex flex-col items-center space-y-3 rounded-lg border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg"
          // >
          //   <span className="text-sm font-medium text-gray-400">{label}</span>
          //   <div className="flex items-center space-x-3">
          //     <Button
          //       type="button"
          //       size="icon"
          //       variant="outline"
          //       onClick={() => handleChange(activePlayerIndex, key, -1)}
          //       className="px-2 py-1 text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:hover:bg-gray-800"
          //     >
          //       -
          //     </Button>
          <Button
            key={key}
            type="button"
            size="icon"
            variant="outline"
            onClick={() => handleChange(activePlayerIndex, key, +1)}
            className="h-15 w-full"
          >
            {label} +
          </Button>
          //   </div>
          // </div>
        ))}
      </div>
    </div>
  );
};

export { PlayerBoxScore };
