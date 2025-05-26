import { getSinglePlayerStatline, getStatlineAverage } from "@/api/statline";
import { getActiveTeamMember } from "@/api/user";
import ChartsBlock from "@/features/statistics";
import { fetchActivityStats } from "@/features/statistics/utils/get-weekly-stats";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: SearchParams;
  params: Promise<{ teamId: string }>;
};

async function StatisticsPage({ params }: PageProps) {
  const { teamId } = await params;
  const members = await getActiveTeamMember(teamId);

  const players = members.map((member) => ({
    ...member,
  }));

  const teamMemberId = "cmb0raaqa0006yzleqeah05uf";
  const activityId = "cmazvv71q000cyzzui2tyicsc";

  const singleStatline = await getSinglePlayerStatline(
    teamMemberId,
    activityId,
    "fieldGoalsMade",
    new Date("2025-05-01"),
    new Date("2025-06-01"),
  );

  if (!singleStatline || !Array.isArray(singleStatline)) {
    console.warn("No statline found or statline is not an array.");
    return null;
  }

  const rawStatsPerActivity = await fetchActivityStats(
    teamMemberId,
    activityId,
    "fieldGoalsMade",
    new Date("2025-05-01"),
    new Date("2025-06-01"),
  );
  const stats = await getStatlineAverage(
    teamMemberId,
    activityId,
    new Date("2025-05-01"),
    new Date("2025-06-01"),
  );

  console.log(
    "Points per game:",
    Math.round(stats.averages.averageAssists).toFixed(1),
  );

  return (
    <ChartsBlock
      players={players}
      singleStatline={singleStatline}
      statsPerActivity={rawStatsPerActivity}
    />
  );
}
export default StatisticsPage;
