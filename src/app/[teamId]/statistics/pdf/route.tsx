import {
  getGamesStatline,
  getStatlineAverage,
  getTeamStats,
} from "@/api/statline";
import { getTeam } from "@/api/team";
import { GameCard } from "@/features/pdf/game-card";
import {
  PDFPlayerTable,
  type PlayerStat,
} from "@/features/pdf/pdf-player-stats-table";
import { PDFTeamOverview } from "@/features/pdf/pdf-team-overview";
import { PDFstyles } from "@/features/pdf/styles/document";
import type { GamesStatlines, TeamInformation, TeamStats } from "@/types";
import {
  Document,
  Page,
  renderToStream,
  Text,
  View,
} from "@react-pdf/renderer";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } },
) {
  try {
    const { teamId } = params;
    const { team } = await getTeam(teamId);
    const stats = await getStatlineAverage(teamId);
    const gamesWithScores = await getGamesStatline(teamId);
    const teamStats = await getTeamStats(teamId);

    const stream = await renderToStream(
      <PDFDocument
        teamName={team.name}
        stats={stats}
        team={team}
        teamStats={teamStats}
        gamesWithScores={gamesWithScores}
      />,
    );

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${team.name}-stats.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function PDFDocument({
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
      </Page>
      <Page size="A4" style={PDFstyles.page}>
        <Text style={PDFstyles.sectionHeader}>All Games Statistics</Text>
        {gamesWithScores.map((game, key) => (
          <GameCard key={key} game={game} team={team} />
        ))}
      </Page>
    </Document>
  );
}
