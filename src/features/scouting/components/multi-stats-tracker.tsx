"use client";
import { Button } from "@/components/button/button";
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState, type FC } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useCreateNewStatline } from "../hooks/use-create-statline";

import { statRows } from "../utils/const";
import { PlayerStatsRow } from "./player-stat-row";

import type { StatlineData } from "../zod/player-stats";
import { defaultStatline, type PlayersData } from "../zod/types";
import { TeamStatsRow } from "./team-stats-row";

const PlayerBoxScore: FC<PlayersData> = ({ players, activityId }) => {
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  const inititalPLayers = players.map((player) => ({
    ...player,
    id: player.id,
    statlines: player.statlines,
  }));

  const { control, handleSubmit, setValue, reset } = useForm<PlayersData>({
    defaultValues: {
      players: inititalPLayers,
      activityId,
    },
  });

  const createStatline = useCreateNewStatline();

  const stats = useWatch<PlayersData>({ control });

  // useDebouncedSave(
  //   stats as PlayersData,
  //   async (data) => {
  //     await createStatline.mutateAsync({
  //       players: data.players.map((player) => ({
  //         id: player.id,
  //         activityId,
  //         statlines: player.statlines,
  //       })),
  //     });
  //   },
  //   60000,
  // );

  useEffect(() => {
    const stored = localStorage.getItem(activityId);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PlayersData;
        if (parsed?.players) {
          reset(parsed);
        }
      } catch (err) {
        console.error("Failed to parse localStorage data", err);
      }
    } else {
      // If nothing in localStorage, use props and reset to that

      reset({
        players: players,
        activityId,
      });
    }
  }, [activityId, players, reset]);

  useEffect(() => {
    localStorage.setItem(activityId, JSON.stringify(stats));
  }, [stats, activityId]);

  const totalTeamStats = stats.players?.reduce(
    (acc, player) => {
      const s = player.statlines?.[0] ?? {};
      for (const key of Object.keys(
        defaultStatline,
      ) as (keyof StatlineData)[]) {
        // Skip non-numeric fields like 'id'
        if (key === "id") continue;
        acc[key] = (acc[key] ?? 0) + (s[key] ?? 0);
      }
      return acc;
    },
    { ...defaultStatline } as StatlineData,
  );

  const handleChange = (
    playerIndex: number,
    field: keyof StatlineData,
    amount: number,
  ) => {
    const current = stats.players?.[playerIndex]?.statlines?.[0]?.[field] ?? 0;
    const updatedValue = Math.max(0, Number(current) + amount);

    setValue(`players.${playerIndex}.statlines.0.${field}`, updatedValue);

    // Immediately save updated stats to localStorage
    const updatedPlayers =
      stats.players?.map((player, i) => {
        if (i === playerIndex) {
          return {
            ...player,
            statlines: [
              {
                ...player.statlines?.[0],
                [field]: updatedValue,
              },
            ],
          };
        }
        return player;
      }) ?? [];

    localStorage.setItem(
      activityId,
      JSON.stringify({ players: updatedPlayers, activityId }),
    );
  };

  const onSubmit = async (data: PlayersData) => {
    const updatedPlayers = data.players.map((player, i) => {
      const previousStats = players[i]?.statlines?.[0] ?? defaultStatline;
      const currentStats = player.statlines?.[0] ?? defaultStatline;

      // Calculate difference for each stat (current - previous)
      const diffStatline = {
        id: currentStats.id || "", // keep current statline id if available
        activityId: activityId,
        fieldGoalsMade:
          (currentStats.fieldGoalsMade ?? 0) -
          (previousStats.fieldGoalsMade ?? 0),
        fieldGoalsMissed:
          (currentStats.fieldGoalsMissed ?? 0) -
          (previousStats.fieldGoalsMissed ?? 0),
        threePointersMade:
          (currentStats.threePointersMade ?? 0) -
          (previousStats.threePointersMade ?? 0),
        threePointersMissed:
          (currentStats.threePointersMissed ?? 0) -
          (previousStats.threePointersMissed ?? 0),
        freeThrows:
          (currentStats.freeThrows ?? 0) - (previousStats.freeThrows ?? 0),
        missedFreeThrows:
          (currentStats.missedFreeThrows ?? 0) -
          (previousStats.missedFreeThrows ?? 0),
        assists: (currentStats.assists ?? 0) - (previousStats.assists ?? 0),
        steals: (currentStats.steals ?? 0) - (previousStats.steals ?? 0),
        turnovers:
          (currentStats.turnovers ?? 0) - (previousStats.turnovers ?? 0),
        rebounds: (currentStats.rebounds ?? 0) - (previousStats.rebounds ?? 0),
        blocks: (currentStats.blocks ?? 0) - (previousStats.blocks ?? 0),
      };

      return {
        id: player.id,
        activityId,
        statlines: [diffStatline],
      };
    });

    // After submit, update your local players to reflect new state, e.g. refetch or:
    await createStatline.mutateAsync({ players: updatedPlayers });
    reset(data);
  };

  if (!stats) return null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="scrollbar-none mx-auto h-full w-full max-w-5xl overflow-y-auto p-4"
    >
      <h2 className="mb-6 text-xl font-bold text-gray-200 sm:text-2xl md:text-3xl">
        Player Box Score
      </h2>
      <div className="flex w-full min-w-full flex-col rounded-lg md:min-h-1/2">
        <Table className="overflow-y-auto rounded-lg border-x shadow-md">
          <TableHeader>
            <TableRow className="bg-neutral-100/90 font-semibold text-white uppercase">
              <TableHead className="p-3 text-left">Name</TableHead>
              <TableHead className="p-3 text-center">PTS</TableHead>
              <TableHead className="p-3 text-center">FG</TableHead>
              <TableHead className="p-3 text-center">3PT</TableHead>
              <TableHead className="p-3 text-center">FT</TableHead>
              <TableHead className="p-3 text-center">REB</TableHead>
              <TableHead className="p-3 text-center">AST</TableHead>
              <TableHead className="p-3 text-center">STL</TableHead>
              <TableHead className="p-3 text-center">BLK</TableHead>
              <TableHead className="p-3 text-center">TO</TableHead>
              <TableHead className="p-3 text-center">Select</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => {
              return (
                <PlayerStatsRow
                  key={index}
                  control={control}
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
          <TableFooter className="bg-gray-800 font-semibold uppercase">
            <TableRow className="text-gray-200">
              {totalTeamStats && (
                <TeamStatsRow totalTeamStats={{ ...totalTeamStats, id: "" }} />
              )}
            </TableRow>
          </TableFooter>
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
      <Button type="submit" variant="outline">
        Submit Stats
      </Button>
    </form>
  );
};

export { PlayerBoxScore };
