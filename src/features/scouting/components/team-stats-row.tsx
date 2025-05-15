import { TableCell } from "@/components/ui/table";
import { calculateTeamStats } from "../utils/update-stat";
import type { StatlineData } from "../zod/player-stats";

interface TeamStatsRowProps {
  totalTeamStats: StatlineData;
}

export const TeamStatsRow = ({ totalTeamStats }: TeamStatsRowProps) => {
  const teamStats = calculateTeamStats(totalTeamStats);
  return (
    <>
      <TableCell className="p-3 text-left font-medium dark:text-white">
        Team
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {teamStats.totalPoints}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {teamStats.fieldGoals.made}/{teamStats.fieldGoals.attempted}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {teamStats.threePointers.made}/{teamStats.threePointers.attempted}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {teamStats.freeThrows.made}/{teamStats.freeThrows.attempted}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {totalTeamStats.rebounds ?? 0}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {totalTeamStats.assists ?? 0}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {totalTeamStats.steals ?? 0}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {totalTeamStats.blocks ?? 0}
      </TableCell>
      <TableCell className="p-3 text-center font-medium dark:text-white">
        {totalTeamStats.turnovers ?? 0}
      </TableCell>
      <TableCell className="p-3 text-left font-medium dark:text-white"></TableCell>
    </>
  );
};
