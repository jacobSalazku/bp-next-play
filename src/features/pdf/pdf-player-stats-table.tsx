import { Text, View } from "@react-pdf/renderer";
import { playerTableStyles } from "./styles/player-table";

export type PlayerStat = {
  name: string | null;
  teamMemberId: string;
  totalPoints: number;
  gamesAttended: number;
  averages: {
    pointsPerGame: number;
    fieldGoalPercentage: number;
    threePointPercentage: number;
    freeThrowPercentage: number;
    assists: number;
    offensiveRebound: number;
    defensiveRebound: number;
    blocks: number;
    steals: number;
    turnovers: number;
  };
};

export function PDFPlayerTable({ stats }: { stats: PlayerStat[] }) {
  return (
    <View style={playerTableStyles.table}>
      <View style={playerTableStyles.headerRow}>
        {["Player", "GP", "PTS", "AST", "REB", "STL", "BLK", "TO"].map(
          (col) => (
            <Text
              style={[playerTableStyles.cell, playerTableStyles.headerCell]}
              key={col}
            >
              {col}
            </Text>
          ),
        )}
      </View>
      {stats.map((player: PlayerStat, i: number) => (
        <View style={playerTableStyles.row} key={i}>
          <Text style={playerTableStyles.cell}>{player.name}</Text>
          <Text style={playerTableStyles.cell}>{player.gamesAttended}</Text>
          <Text style={playerTableStyles.cell}>
            {player.averages?.pointsPerGame ?? 0}
          </Text>
          <Text style={playerTableStyles.cell}>
            {player.averages?.assists ?? 0}
          </Text>
          <Text style={playerTableStyles.cell}>
            {Number(player.averages?.offensiveRebound ?? 0) +
              Number(player.averages?.defensiveRebound ?? 0)}
          </Text>
          <Text style={playerTableStyles.cell}>
            {player.averages?.steals ?? 0}
          </Text>
          <Text style={playerTableStyles.cell}>
            {player.averages?.blocks ?? 0}
          </Text>
          <Text style={playerTableStyles.cell}>
            {player.averages?.turnovers ?? 0}
          </Text>
        </View>
      ))}
    </View>
  );
}
