import { Button } from "@/components/foundation/button/button";
import type { TeamMembers } from "@/types";
import { otherStats } from "../../utils/const";
import { calculateStats } from "../../utils/update-stat";
import type { StatlineData } from "../../zod/player-stats";

import type { FormEventHandler } from "react";
import MobileTeamStatsRow from "./mobile-team-stats-row";
import { StatButton } from "./stats-button";

type MobileStatsFormProps = {
  activityId: string;
  players: TeamMembers;
  activePlayerIndex: number;
  setActivePlayerIndex: (index: number) => void;
  statsForPlayer: StatlineData;
  totalTeamStats: StatlineData;
  onSubmit: FormEventHandler<HTMLFormElement> | undefined;
  onIncrement: (
    playerIndex: number,
    field: keyof StatlineData,
    amount: number,
  ) => void;
};

export const MobileMultiStatlineTracker = ({
  activityId,
  players,
  activePlayerIndex,
  setActivePlayerIndex,
  totalTeamStats,
  onSubmit,
  onIncrement,
  statsForPlayer,
}: MobileStatsFormProps) => {
  const { fieldGoals, freeThrows, threePointers } =
    calculateStats(statsForPlayer);

  return (
    <form
      key={activityId}
      onSubmit={onSubmit}
      className="w-full space-y-6 rounded-xl bg-gray-950 px-2"
    >
      <h2 className="font-righteous mb-6 text-2xl font-bold text-gray-100 sm:text-4xl">
        Player Box Score
      </h2>

      {/* Player Switcher */}
      <div className="scrollbar-none flex gap-2 overflow-x-auto">
        {players.map((player, index) => (
          <Button
            key={index}
            type="button"
            onClick={() => setActivePlayerIndex(index)}
            variant={activePlayerIndex === index ? "secondary" : "default"}
          >
            {player.name}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        {/* Made Shots */}
        <div className="grid grid-cols-3 gap-2 text-center text-white">
          <StatButton
            statKey="fieldGoalsMade"
            onIncrement={() =>
              onIncrement(activePlayerIndex, "fieldGoalsMade", 1)
            }
            label="FG Made"
            value={fieldGoals.made}
            className="bg-green-800 py-4 hover:bg-green-700"
          />
          <StatButton
            statKey="threePointersMade"
            onIncrement={() =>
              onIncrement(activePlayerIndex, "threePointersMade", 1)
            }
            label="3PT Made"
            value={threePointers.made}
            className="bg-green-800 py-4 hover:bg-green-700"
          />
          <StatButton
            statKey="freeThrows"
            onIncrement={() => onIncrement(activePlayerIndex, "freeThrows", 1)}
            label="FT Made"
            value={freeThrows.made}
            className="bg-green-800 py-4 hover:bg-green-700"
          />
        </div>

        {/* Missed Shots */}
        <div className="grid grid-cols-3 gap-2 text-center text-white">
          <StatButton
            statKey="fieldGoalsMissed"
            onIncrement={() =>
              onIncrement(activePlayerIndex, "fieldGoalsMissed", 1)
            }
            label="FG Missed"
            value={fieldGoals.attempted - fieldGoals.made}
            className="bg-red-700 py-4 hover:bg-red-600 active:bg-red-500"
          />
          <StatButton
            statKey="threePointersMissed"
            onIncrement={() =>
              onIncrement(activePlayerIndex, "threePointersMissed", 1)
            }
            label="3PT Missed"
            value={threePointers.attempted - threePointers.made}
            className="bg-red-700 py-4 hover:bg-red-600 active:bg-red-500"
          />
          <StatButton
            statKey="missedFreeThrows"
            onIncrement={() =>
              onIncrement(activePlayerIndex, "missedFreeThrows", 1)
            }
            label="FT Missed"
            value={freeThrows.attempted - freeThrows.made}
            className="bg-red-700 py-4 hover:bg-red-600 active:bg-red-500"
          />
        </div>

        {/* Other stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-white">
          {otherStats.map(({ key, label }) => (
            <StatButton
              key={key}
              statKey={key as keyof StatlineData}
              label={label}
              value={Number(statsForPlayer[key as keyof StatlineData] ?? "")}
              onIncrement={(key) => onIncrement(activePlayerIndex, key, 1)}
            />
          ))}
        </div>
      </div>

      {totalTeamStats && <MobileTeamStatsRow totalTeamStats={totalTeamStats} />}

      <div className="pt-4">
        <Button type="submit" variant="outline" size="full">
          Submit Stats
        </Button>
      </div>
    </form>
  );
};
