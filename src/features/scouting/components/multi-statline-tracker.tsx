"use client";

import { Button } from "@/components/foundation/button/button";
import { Table } from "@/components/foundation/table/table";
import { TableBody } from "@/components/foundation/table/table-body";
import { TableFooter } from "@/components/foundation/table/table-footer";
import { TableHead } from "@/components/foundation/table/table-head";
import { TableHeader } from "@/components/foundation/table/table-header";
import { TableRow } from "@/components/foundation/table/table-row";
import { useTeam } from "@/context/team-context";
import { useDebouncedSave } from "@/hooks/use-debounce";
import type { ActivityInformation, TeamMembers } from "@/types";
import { useState, type FC } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useCreateNewStatline } from "../hooks/use-create-statline";
import {
  calculateRawTeamStats,
  getInitalPlayers,
  getInitialOpponentStatline,
} from "../utils";
import { statRows } from "../utils/const";
import { sanitizeStatline } from "../utils/sanitize";
import type { OpponentStatsline, StatlineData } from "../zod/player-stats";
import { defaultOpponentStatline, defaultStatline } from "../zod/types";
import { MobileMultiStatlineTracker } from "./mobile/mobile-multi-statline-tracker";
import { PlayerStatsRow } from "./player-stat-row";
import { TeamStatsRow } from "./team-stats-row";

export type PlayersData = {
  teamId: string;
  players: TeamMembers;
  activityId: string;
  opponentStatline: OpponentStatsline;
};

type TrackerProps = {
  players: TeamMembers;
  activity: ActivityInformation;
};

const MultiStatlineTracker: FC<TrackerProps> = ({ players, activity }) => {
  const { teamSlug } = useTeam();
  const [showOpponentStats, setShowOpponentStats] = useState(false);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const createStatline = useCreateNewStatline();

  const [lastChange, setLastChange] = useState<{
    playerIndex: number;
    field: keyof StatlineData;
    previousValue: number;
  } | null>(null);

  const initialPlayers = getInitalPlayers(players, activity.id);

  const initialOpponentStatline = getInitialOpponentStatline(
    activity.opponentStatline ?? defaultOpponentStatline,
    activity.id,
  );

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<PlayersData>({
    defaultValues: {
      teamId: teamSlug,
      players: initialPlayers,
      activityId: activity.id,
      opponentStatline: initialOpponentStatline,
    },
  });

  const stats = useWatch<PlayersData>({ control });

  const statsForPlayer =
    stats.players?.[activePlayerIndex]?.statlines?.[0] ?? defaultStatline;

  const totalTeamStats = calculateRawTeamStats(stats.players as TeamMembers);

  const handleChange = (
    playerIndex: number,
    field: keyof StatlineData,
    amount: number,
  ) => {
    const current = stats.players?.[playerIndex]?.statlines?.[0]?.[field] ?? 0;
    const updatedValue = Math.max(0, Number(current) + amount);

    // Save previous state for undo
    setLastChange({
      playerIndex,
      field,
      previousValue: Number(current),
    });

    setValue(`players.${playerIndex}.statlines.0.${field}`, updatedValue);
  };

  const handleUndo = () => {
    if (!lastChange) return;

    const { playerIndex, field, previousValue } = lastChange;

    setValue(`players.${playerIndex}.statlines.0.${field}`, previousValue);
    setLastChange(null);
  };

  const onSubmit = async (data: PlayersData) => {
    const updatedPlayers = data.players.map((player) => {
      const curr = sanitizeStatline(player.statlines?.[0] ?? {});

      return {
        ...player,
        teamId: teamSlug,
        activityId: activity.id,
        statlines: [curr],
      };
    });

    await createStatline.mutateAsync({
      teamId: teamSlug,
      players: updatedPlayers,
      opponentStatline: {
        name: activity.title,
        fieldGoalsMade: data.opponentStatline.fieldGoalsMade,
        threePointersMade: data.opponentStatline.threePointersMade,
        freeThrowsMade: data.opponentStatline.freeThrowsMade,
        activityId: activity.id,
      },
    });

    reset({
      players: updatedPlayers,
      opponentStatline: {
        name: activity.title,
        fieldGoalsMade: data.opponentStatline.fieldGoalsMade,
        threePointersMade: data.opponentStatline.threePointersMade,
        freeThrowsMade: data.opponentStatline.freeThrowsMade,
        activityId: activity.id,
      },
    });
  };

  useDebouncedSave(stats as PlayersData, onSubmit, 10000);

  if (!stats) return null;

  return (
    <>
      <MobileMultiStatlineTracker
        players={players}
        activity={activity}
        totalTeamStats={totalTeamStats}
        activePlayerIndex={activePlayerIndex}
        setActivePlayerIndex={setActivePlayerIndex}
        onIncrement={handleChange}
        statsForPlayer={statsForPlayer as StatlineData}
        onSubmit={handleSubmit(onSubmit)}
        opponentStatline={stats.opponentStatline as OpponentStatsline}
        setValue={setValue}
        undoLastChange={handleUndo}
      />
      <form
        key={activity.id}
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto hidden w-full p-4 sm:p-6 lg:block"
      >
        <h2 className="font-righteous mb-6 text-2xl font-bold text-gray-100 sm:text-4xl">
          Player Box Score
        </h2>
        <div className="mb-5">
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowOpponentStats((prev) => !prev)}
            >
              {showOpponentStats ? "Hide" : "Show"} Opponent Stats
            </Button>
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleUndo}
                disabled={!lastChange}
              >
                Undo Last Stat
              </Button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Saving..." : "Save Stats"}
            </Button>
          </div>

          {showOpponentStats && (
            <div className="mt-4 rounded-xl bg-gray-900 px-4 py-2 shadow">
              <h3 className="mb-4 text-xl font-bold text-white">
                {activity.title} Stats
              </h3>
              <div className="grid grid-cols-3 gap-4 text-white">
                <Button
                  variant="outline"
                  onClick={() =>
                    setValue(
                      "opponentStatline.fieldGoalsMade",
                      (stats.opponentStatline?.fieldGoalsMade ?? 0) + 1,
                    )
                  }
                >
                  2PT +
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setValue(
                      "opponentStatline.threePointersMade",
                      (stats.opponentStatline?.threePointersMade ?? 0) + 1,
                    )
                  }
                >
                  3PT +
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setValue(
                      "opponentStatline.freeThrowsMade",
                      (stats.opponentStatline?.freeThrowsMade ?? 0) + 1,
                    )
                  }
                >
                  FT +
                </Button>
              </div>
              <div className="mt-4 text-white">
                <p>
                  Total Opponent Points:{" "}
                  {(stats.opponentStatline?.fieldGoalsMade ?? 0) * 2 +
                    (stats.opponentStatline?.threePointersMade ?? 0) * 3 +
                    (stats.opponentStatline?.freeThrowsMade ?? 0)}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="rounded-2xl bg-gray-900 p-2 shadow-lg backdrop-blur-lg sm:p-4">
          <div className="overflow-x-auto rounded-xl border border-gray-950 shadow-sm">
            <Table className="min-w-[700px] text-sm">
              <TableHeader>
                <TableRow className="bg-gray-950 text-xs text-gray-200 uppercase sm:text-sm">
                  <TableHead className="p-2 text-left sm:p-4">Name</TableHead>
                  <TableHead className="p-2 text-center sm:p-4">PTS</TableHead>
                  <TableHead className="p-2 text-center sm:p-4">FG</TableHead>
                  <TableHead className="p-2 text-center sm:p-4">3PT</TableHead>
                  <TableHead className="p-2 text-center sm:p-4">FT</TableHead>
                  <TableHead className="p-2 text-center sm:p-4">REB</TableHead>
                  <TableHead className="p-2 text-center sm:p-4">AST</TableHead>
                  <TableHead className="p-2 text-center sm:p-4">STL</TableHead>
                  <TableHead className="p-2 text-center sm:p-4">BLK</TableHead>
                  <TableHead className="p-2 text-center sm:p-4">TO</TableHead>
                  <TableHead className="p-2 text-center sm:p-4">
                    Select
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player, index) => (
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
                ))}
              </TableBody>
              <TableFooter className="bg-gray-950 text-gray-300">
                <TableRow>
                  {totalTeamStats && (
                    <TeamStatsRow
                      totalTeamStats={{ ...totalTeamStats, id: "" }}
                    />
                  )}
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {statRows.map(({ key, label }) => (
            <Button
              key={key}
              type="button"
              size="lg"
              variant="light"
              onClick={() => handleChange(activePlayerIndex, key, +1)}
            >
              {label} +
            </Button>
          ))}
        </div>
      </form>
    </>
  );
};

export { MultiStatlineTracker };
