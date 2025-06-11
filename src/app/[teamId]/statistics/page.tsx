import { getStatlineAverage, getTeamStats } from "@/api/statline";
import { getTeam } from "@/api/team";
import WithAuth from "@/features/auth/components/with-auth";
import StatisticsBlock from "@/features/statistics";
import StatisticsSkeleton from "@/features/statistics/components/skeleton-statistics";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ teamId: string }>;
};

async function StatisticsPage({ params }: PageProps) {
  const { teamId } = await params;
  const { team } = await getTeam(teamId);
  const statsList = await getStatlineAverage(teamId);
  const stats = await getTeamStats(teamId);

  if (!team) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-white">no team is Found</div>
      </div>
    );
  }

  return (
    <div className="scrollbar-none overflow-y-auto">
      <Suspense fallback={<StatisticsSkeleton />}>
        <StatisticsBlock
          teamStatlist={stats}
          statsList={statsList}
          team={team}
        />
      </Suspense>
    </div>
  );
}
export default WithAuth(StatisticsPage);
