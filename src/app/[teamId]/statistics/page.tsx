import { getStatlineAverage } from "@/api/statline";
import { getActiveTeamMember } from "@/api/user";
import ChartsBlock from "@/features/statistics";
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

  const activityId = "cmazvv71q000cyzzui2tyicsc";

  // const singleStatline = await getSinglePlayerStatline(
  //   players[0]?.id ?? "",
  //   activityId,
  //   "fieldGoalsMade",
  //   new Date("2025-05-01"),
  //   new Date("2025-06-01"),
  // );

  // if (!singleStatline || !Array.isArray(singleStatline)) {
  //   console.warn("No statline found or statline is not an array.");
  //   return null;
  // }

  // const rawStatsPerActivity = await fetchActivityStats(
  //   players[0]?.id ?? "",
  //   activityId,
  //   "fieldGoalsMade",
  //   new Date("2025-05-01"),
  //   new Date("2025-06-01"),
  // );

  // const stats = await getStatlineAverage(
  //   players[0]?.id ?? "",
  //   activityId,
  //   new Date("2025-05-01"),
  //   new Date("2025-06-01"),
  // );

  const statsList = await Promise.all(
    players.map(async (player) => {
      console.log(player.id, activityId);
      const stats = await getStatlineAverage(
        player.id,
        activityId,
        new Date("2025-05-01"),
        new Date("2025-06-01"),
      );
      return {
        ...player,
        stats,
      };
    }),
  );

  console.log(
    "Points per game:",
    statsList.map((player) => ({
      name: player.name,
      pointsPerGame: player.stats?.totalPoints,
      assistsPerGame: player.stats?.averages.averageAssists,
      reboundsPerGame: player.stats?.averages.averageRebounds,
      blocksPerGame: player.stats?.averages.averageBlocks,
      stealsPerGame: player.stats?.averages.averageSteals,
      fieldGoalsMadePerGame: player.stats?.averages.averageFieldGoalsMade,
      threePointersMadePerGame: player.stats?.averages.averageThreePointersMade,
      freeThrowsMadePerGame: player.stats?.averages.averageFreeThrowsMade,
      turnoversPerGame: player.stats?.averages.averageTurnovers,
    })),
  );

  // Transform statsList to match ActivityStat[] structure

  return <ChartsBlock statsPerActivity={statsList} />;
}
export default StatisticsPage;
