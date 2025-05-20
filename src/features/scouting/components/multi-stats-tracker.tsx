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
import type { TeamMembers } from "@/types";
import { useEffect, useState, type FC } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useCreateNewStatline } from "../hooks/use-create-statline";
import { statRows } from "../utils/const";
import type { StatlineData } from "../zod/player-stats";
import { defaultStatline } from "../zod/types";
import { PlayerStatsRow } from "./player-stat-row";
import { TeamStatsRow } from "./team-stats-row";

export type PlayersData = {
  players: TeamMembers;
  activityId: string;
};

const PlayerBoxScore: FC<PlayersData> = ({ players, activityId }) => {
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const createStatline = useCreateNewStatline();

  const initialPlayers = players.map((p) => ({
    ...p,
    statlines: p.statlines,
  }));

  const { control, handleSubmit, setValue, reset } = useForm<PlayersData>({
    defaultValues: { players: initialPlayers, activityId },
  });

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
        // Only sum numeric fields, skip 'id'
        if (key !== "id") {
          acc[key] = (acc[key] ?? 0) + (s[key] ?? 0);
        }
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
      const prev = players[i]?.statlines?.[0] ?? defaultStatline;
      const curr = player.statlines?.[0] ?? defaultStatline;

      const diff: StatlineData = {
        id: "",
        fieldGoalsMade: (curr.fieldGoalsMade ?? 0) - (prev.fieldGoalsMade ?? 0),
        fieldGoalsMissed:
          (curr.fieldGoalsMissed ?? 0) - (prev.fieldGoalsMissed ?? 0),
        threePointersMade:
          (curr.threePointersMade ?? 0) - (prev.threePointersMade ?? 0),
        threePointersMissed:
          (curr.threePointersMissed ?? 0) - (prev.threePointersMissed ?? 0),
        freeThrows: (curr.freeThrows ?? 0) - (prev.freeThrows ?? 0),
        missedFreeThrows:
          (curr.missedFreeThrows ?? 0) - (prev.missedFreeThrows ?? 0),
        assists: (curr.assists ?? 0) - (prev.assists ?? 0),
        steals: (curr.steals ?? 0) - (prev.steals ?? 0),
        turnovers: (curr.turnovers ?? 0) - (prev.turnovers ?? 0),
        rebounds: (curr.rebounds ?? 0) - (prev.rebounds ?? 0),
        blocks: (curr.blocks ?? 0) - (prev.blocks ?? 0),
      };

      return {
        id: player.id,
        activityId,
        statlines: [diff],
      };
    });

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
