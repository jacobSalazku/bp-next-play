import { getStatlineAverage } from "@/api/statline";
import { getTeam } from "@/api/team";
import StatisticsBlock from "@/features/statistics";

type PageProps = {
  params: Promise<{ teamId: string }>;
};

async function StatisticsPage({ params }: PageProps) {
  const { teamId } = await params;
  const { team } = await getTeam(teamId);

  const statsList = await getStatlineAverage(
    teamId,
    new Date("2025-05-01"),
    new Date("2025-06-01"),
  );

  return <StatisticsBlock statsList={statsList} team={team} />;
}
export default StatisticsPage;
