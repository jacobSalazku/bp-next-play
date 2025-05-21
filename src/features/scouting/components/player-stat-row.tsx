"use client";

import { Button } from "@/components/foundation/button/button";
import { TableCell } from "@/components/foundation/table/table-cell";
import { TableRow } from "@/components/foundation/table/table-row";
import type { TeamMember } from "@/types";
import { Controller, type Control } from "react-hook-form";
import { calculateStats } from "../utils/update-stat";
import type { StatlineData } from "../zod/player-stats";
import type { PlayersData } from "./multi-stats-tracker";

type PlayerStatsRowProps = {
  player: TeamMember;
  index: number;
  statsForPlayer: StatlineData;
  activePlayerIndex: number;
  setActivePlayerIndex: (index: number) => void;
  control: Control<PlayersData>;
};

export const PlayerStatsRow = ({
  player,
  index,
  control,
  statsForPlayer,
  activePlayerIndex,
  setActivePlayerIndex,
}: PlayerStatsRowProps) => {
  const { fieldGoals, freeThrows, threePointers, totalPoints } =
    calculateStats(statsForPlayer);

  return (
    <>
      <Controller
        control={control}
        name={`players.${index}.id`}
        defaultValue={player.id}
        render={() => <></>}
      />
      <TableRow>
        <TableCell className="hidden p-3 text-left font-medium lg:table-cell dark:text-white">
          {player.user.name}
        </TableCell>
        <TableCell className="p-3 text-left font-medium lg:hidden dark:text-white">
          #{player.number}
        </TableCell>
        <TableCell className="p-3 text-center align-middle dark:text-gray-300">
          {totalPoints}
        </TableCell>
        <TableCell className="p-3 text-center align-middle dark:text-gray-300">
          {fieldGoals.made}/{fieldGoals.attempted}
        </TableCell>
        <TableCell className="p-3 text-center align-middle dark:text-gray-300">
          {threePointers.made}/{threePointers.attempted}
        </TableCell>
        <TableCell className="p-3 text-center align-middle dark:text-gray-300">
          {freeThrows.made}/{freeThrows.attempted}
        </TableCell>
        <TableCell className="p-3 text-center align-middle dark:text-gray-300">
          {statsForPlayer?.rebounds ?? 0}
        </TableCell>
        <TableCell className="p-3 text-center align-middle dark:text-gray-300">
          {statsForPlayer?.assists ?? 0}
        </TableCell>
        <TableCell className="p-3 text-center align-middle dark:text-gray-300">
          {statsForPlayer?.steals ?? 0}
        </TableCell>
        <TableCell className="p-3 text-center align-middle dark:text-gray-300">
          {statsForPlayer?.blocks ?? 0}
        </TableCell>
        <TableCell className="p-3 text-center align-middle dark:text-gray-300">
          {statsForPlayer?.turnovers ?? 0}
        </TableCell>

        <TableCell className="p-3 text-center align-middle">
          <Button
            type="button"
            variant={index === activePlayerIndex ? "secondary" : "outline"}
            onClick={() => setActivePlayerIndex(index)}
            size="sm"
          >
            {index === activePlayerIndex ? "Active" : "Select"}
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};
