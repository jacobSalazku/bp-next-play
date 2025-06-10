import type { GamesStatlines, TeamInformation } from "@/types";
import { Text, View } from "@react-pdf/renderer";
import { gamesStyles } from "./styles/game-card";

export function GameCard({
  game,
  team,
}: {
  game: GamesStatlines;
  team: TeamInformation;
}) {
  const teamPoints =
    (game.teamTotals.fieldGoalsMade ?? 0) * 2 +
    (game.teamTotals.threePointersMade ?? 0) * 3 +
    (game.teamTotals.freeThrows ?? 0);

  const opponentPoints =
    (game.opponentStats.fieldGoalsMade ?? 0) * 2 +
    (game.opponentStats.threePointersMade ?? 0) * 3 +
    (game.opponentStats.freeThrowsMade ?? 0);

  return (
    <View style={gamesStyles.gameCard} wrap={false}>
      <View style={gamesStyles.gameHeader}>
        <Text style={gamesStyles.dateText}>
          {new Date(game.date).toLocaleString("nl-BE", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <View style={gamesStyles.scoreRow}>
        <Text style={gamesStyles.teamName}>{team.name}</Text>
        <Text style={gamesStyles.scoreValue}>{teamPoints}</Text>
        <Text style={gamesStyles.dash}>–</Text>
        <Text style={gamesStyles.scoreValue}>{opponentPoints}</Text>
        <Text style={gamesStyles.opponentName}>{game.opponentName}</Text>
      </View>
      <View style={gamesStyles.boxScoreHeader}>
        <Text style={[gamesStyles.cell, gamesStyles.playerName]}>Player</Text>
        <Text style={gamesStyles.cell}>PTS</Text>
        <Text style={gamesStyles.cell}>AST</Text>
        <Text style={gamesStyles.cell}>REB</Text>
        <Text style={gamesStyles.cell}>STL</Text>
        <Text style={gamesStyles.cell}>BLK</Text>
        <Text style={gamesStyles.cell}>TO</Text>
      </View>
      {game.playerStats.map((p, idx) => (
        <View key={idx} style={gamesStyles.boxScoreRow}>
          <Text style={[gamesStyles.cell, gamesStyles.playerName]}>
            {p.teamMember.user?.name ?? "Unnamed"}
          </Text>
          <Text style={gamesStyles.cell}>{}</Text>
          <Text style={gamesStyles.cell}>{p.assists}</Text>
          <Text style={gamesStyles.cell}>
            {(p.offensiveRebounds ?? 0) + (p.defensiveRebounds ?? 0)}
          </Text>
          <Text style={gamesStyles.cell}>{p.steals}</Text>
          <Text style={gamesStyles.cell}>{p.blocks}</Text>
          <Text style={gamesStyles.cell}>{p.turnovers}</Text>
        </View>
      ))}
    </View>
  );
}
