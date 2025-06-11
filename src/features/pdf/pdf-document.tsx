import type { GamesStatlines, TeamInformation, TeamStats } from "@/types";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { GameCard } from "./game-card";
import { PDFPlayerTable, type PlayerStat } from "./pdf-player-stats-table";
import { PDFTeamOverview } from "./pdf-team-overview";
import { PDFstyles } from "./styles/document";

export function PDFDocument({
  teamStats,
  team,
  teamName,
  stats,
  gamesWithScores,
}: {
  teamStats: TeamStats;
  team: TeamInformation;
  teamName: string;
  stats: PlayerStat[];
  gamesWithScores: GamesStatlines[];
}) {
  return (
    <Document>
      <Page size="A4" style={PDFstyles.page}>
        <View style={PDFstyles.header}>
          <Text>NextPlays</Text>
        </View>
        <View style={PDFstyles.section}>
          <Text>{teamName} Team Stats</Text>
          <Text style={{ fontSize: 14, color: "#6b7280" }}>
            {new Date().toLocaleDateString("nl-BE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <PDFTeamOverview teamStats={teamStats} />
      </Page>
      <Page size="A4" style={PDFstyles.page}>
        <Text style={PDFstyles.sectionHeader}>Player Averages</Text>
        <PDFPlayerTable stats={stats} />
      </Page>{" "}
      <Page size="A4" style={PDFstyles.page}>
        <Text style={PDFstyles.sectionHeader}>All Games Statistics</Text>
        {gamesWithScores.map((game, key) => (
          <GameCard key={key} game={game} team={team} />
        ))}
      </Page>
    </Document>
  );
}
