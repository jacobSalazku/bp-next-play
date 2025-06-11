import {
  getGamesStatline,
  getStatlineAverage,
  getTeamStats,
} from "@/api/statline";
import { getTeam } from "@/api/team";
import { PDFDocument } from "@/features/pdf/pdf-document";
import { renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> },
) {
  try {
    const { teamId } = await params;
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
