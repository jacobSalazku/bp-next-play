import { Button } from "@/components/button/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { TeamMember } from "@/types";
import { calculateStats } from "../utils/update-stat";
import type { StatlineData } from "../zod/player-stats";

type PlayerStatsRowProps = {
  player: TeamMember;
  index: number;
  statsForPlayer: StatlineData;
  activePlayerIndex: number;
  setActivePlayerIndex: (index: number) => void;
};

export const PlayerStatsRow = ({
  player,
  index,
  statsForPlayer,
  activePlayerIndex,
  setActivePlayerIndex,
}: PlayerStatsRowProps) => {
  const { fieldGoals, freeThrows, threePointers, totalPoints } =
    calculateStats(statsForPlayer);

  return (
    <TableRow>
      <TableCell className="p-3 text-left font-medium dark:text-white">
        {player.name}
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
          variant={index === activePlayerIndex ? "danger" : "outline"}
          onClick={() => setActivePlayerIndex(index)}
          size="sm"
        >
          {index === activePlayerIndex ? "Active" : "Select"}
        </Button>
      </TableCell>
    </TableRow>
  );
};
