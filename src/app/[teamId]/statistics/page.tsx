import { getStatlineAverage, getTeamStats } from "@/api/statline";
import { getTeam } from "@/api/team";
import StatisticsBlock from "@/features/statistics";

type PageProps = {
  params: Promise<{ teamId: string }>;
};

async function StatisticsPage({ params }: PageProps) {
  const { teamId } = await params;
  const { team } = await getTeam(teamId);

  const statsList = await getStatlineAverage(teamId);
  const stats = await getTeamStats();

  return (
    <div className="overflow-y-auto">
      <StatisticsBlock teamStatlist={stats} statsList={statsList} team={team} />
    </div>
  );
}
export default StatisticsPage;
