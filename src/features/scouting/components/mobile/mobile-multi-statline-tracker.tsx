import { Button } from "@/components/foundation/button/button";
import type { ActivityInformation, TeamMembers } from "@/types";
import { cn } from "@/utils/tw-merge";
import type { FormEventHandler } from "react";
import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { otherStats } from "../../utils/const";
import { calculateStats } from "../../utils/update-stat";
import type { OpponentStatsline, StatlineData } from "../../zod/player-stats";
import type { PlayersData } from "../multi-statline-tracker";
import MobileTeamStatsRow from "./mobile-team-stats-row";
import { StatButton } from "./stats-button";

type MobileStatsFormProps = {
  activity: ActivityInformation;
  players: TeamMembers;
  activePlayerIndex: number;
  setActivePlayerIndex: (index: number) => void;
  statsForPlayer: StatlineData;
  totalTeamStats: StatlineData;
  opponentStatline: OpponentStatsline;
  onSubmit: FormEventHandler<HTMLFormElement> | undefined;
  onIncrement: (
    playerIndex: number,
    field: keyof StatlineData,
    amount: number,
  ) => void;
  setValue: UseFormSetValue<PlayersData>;
};

export const MobileMultiStatlineTracker = ({
  activity,
  players,
  activePlayerIndex,
  setActivePlayerIndex,
  statsForPlayer,
  totalTeamStats,
  onSubmit,
  onIncrement,
  opponentStatline,
  setValue,
}: MobileStatsFormProps) => {
  const [showOpponentStats, setShowOpponentStats] = useState(false);

  const { fieldGoals, freeThrows, threePointers } =
    calculateStats(statsForPlayer);

  return (
    <form
      key={activity.id}
      onSubmit={onSubmit}
      className="w-full space-y-6 overflow-y-auto rounded-xl bg-gray-950 px-2 lg:hidden"
    >
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

      <Button
        variant="outline"
        className="mb-4 w-full"
        onClick={() => setShowOpponentStats((prev) => !prev)}
      >
        {showOpponentStats ? "Hide" : "Show"} Opponent Stats
      </Button>

      {showOpponentStats && (
        <div
          className={cn(
            showOpponentStats
              ? "max-h-[1000px] opacity-100"
              : "max-h-0 opacity-0",
            "overflow-hidden transition-all duration-500 ease-in-out",
          )}
        >
          <h3 className="mb-4 text-xl font-bold">{activity.title} Stats</h3>

          <div className="grid grid-cols-3 gap-2 text-center">
            <StatButton
              statKey="fieldGoalsMade"
              onIncrement={() =>
                setValue(
                  "opponentStatline.fieldGoalsMade",
                  (opponentStatline?.fieldGoalsMade ?? 0) + 1,
                )
              }
              label="2PT Made"
              value={opponentStatline?.fieldGoalsMade ?? 0}
            />
            <StatButton
              statKey="threePointersMade"
              onIncrement={() =>
                setValue(
                  "opponentStatline.threePointersMade",
                  (opponentStatline?.threePointersMade ?? 0) + 1,
                )
              }
              label="3PT Made"
              value={opponentStatline?.threePointersMade ?? 0}
            />
            <StatButton
              statKey="freeThrowsMade"
              onIncrement={() =>
                setValue(
                  "opponentStatline.freeThrowsMade",
                  (opponentStatline?.freeThrowsMade ?? 0) + 1,
                )
              }
              label="FT Made"
              value={opponentStatline?.freeThrowsMade ?? 0}
            />
          </div>

          <div className="mt-4 text-center text-white">
            <p className="font-semibold">
              Total Opponent Points:{" "}
              {(opponentStatline?.fieldGoalsMade ?? 0) * 2 +
                (opponentStatline?.threePointersMade ?? 0) * 3 +
                (opponentStatline?.freeThrowsMade ?? 0)}
            </p>
          </div>
        </div>
      )}

      {/* Team Player Stats */}
      <div className="space-y-2">
        {/* Made */}
        <div className="grid grid-cols-3 gap-2 text-center text-white">
          <StatButton
            statKey="fieldGoalsMade"
            onIncrement={() =>
              onIncrement(activePlayerIndex, "fieldGoalsMade", 1)
            }
            label="FG Made"
            value={fieldGoals.made}
          />
          <StatButton
            statKey="threePointersMade"
            onIncrement={() =>
              onIncrement(activePlayerIndex, "threePointersMade", 1)
            }
            label="3PT Made"
            value={threePointers.made}
          />
          <StatButton
            statKey="freeThrows"
            onIncrement={() => onIncrement(activePlayerIndex, "freeThrows", 1)}
            label="FT Made"
            value={freeThrows.made}
          />
        </div>

        {/* Missed */}
        <div className="grid grid-cols-3 gap-2 text-center text-white">
          <StatButton
            statKey="fieldGoalsMissed"
            onIncrement={() =>
              onIncrement(activePlayerIndex, "fieldGoalsMissed", 1)
            }
            label="FG Missed"
            value={fieldGoals.attempted - fieldGoals.made}
          />
          <StatButton
            statKey="threePointersMissed"
            onIncrement={() =>
              onIncrement(activePlayerIndex, "threePointersMissed", 1)
            }
            label="3PT Missed"
            value={threePointers.attempted - threePointers.made}
          />
          <StatButton
            statKey="missedFreeThrows"
            onIncrement={() =>
              onIncrement(activePlayerIndex, "missedFreeThrows", 1)
            }
            label="FT Missed"
            value={freeThrows.attempted - freeThrows.made}
          />
        </div>

        {/* Other */}
        <div className="grid grid-cols-3 gap-2 text-center text-white">
          {otherStats.map(({ key, label }) => (
            <StatButton
              key={key}
              statKey={key as keyof StatlineData}
              label={label}
              value={Number(statsForPlayer[key as keyof StatlineData] ?? "")}
              onIncrement={(key) =>
                onIncrement(activePlayerIndex, key as keyof StatlineData, 1)
              }
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
