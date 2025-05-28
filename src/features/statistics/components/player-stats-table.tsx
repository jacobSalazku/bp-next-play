import type { Statlines } from "@/types";

const PlayerAveragesTable = ({ statsList }: { statsList: Statlines }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300 text-sm">
        <thead className="">
          <tr>
            <th className="px-4 py-2 text-left">Player</th>
            <th className="px-4 py-2 text-left">GP</th>
            <th className="px-4 py-2">Points</th>
            <th className="px-4 py-2">AST</th>
            <th className="px-4 py-2">RB</th>
            <th className="px-4 py-2">BLK</th>
            <th className="px-4 py-2">STL</th>
            <th className="px-4 py-2">FG Made</th>
            <th className="px-4 py-2">3P Made</th>
            <th className="px-4 py-2">FT Made</th>
            <th className="px-4 py-2">Turnovers</th>
          </tr>
        </thead>
        <tbody>
          {statsList.length > 0 ? (
            statsList.map((player) => (
              <tr key={player.teamMemberId} className="border-t">
                <td className="px-4 py-2">{player.name}</td>
                <td className="px-4 py-2">{player.gamesAttended}</td>
                <td className="px-4 py-2">
                  {player.averages.averagePointsPerGame.toFixed(1) ?? "-"}
                </td>
                <td className="px-4 py-2">
                  {player.averages.averageAssists?.toFixed(1) ?? "-"}
                </td>
                <td className="px-4 py-2">
                  {player.averages.averageRebounds?.toFixed(1) ?? "-"}
                </td>
                <td className="px-4 py-2">
                  {player.averages.averageBlocks?.toFixed(1) ?? "-"}
                </td>
                <td className="px-4 py-2">
                  {player.averages.averageSteals?.toFixed(1) ?? "-"}
                </td>
                <td className="px-4 py-2">
                  {player.averages.averageFieldGoalsMade?.toFixed(1) ?? "-"}
                </td>
                <td className="px-4 py-2">
                  {player.averages.averageThreePointersMade?.toFixed(1) ?? "-"}
                </td>
                <td className="px-4 py-2">
                  {player.averages.averageFreeThrowsMade?.toFixed(1) ?? "-"}
                </td>
                <td className="px-4 py-2">
                  {player.averages.averageTurnovers?.toFixed(1) ?? "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="px-4 py-2 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export { PlayerAveragesTable };
