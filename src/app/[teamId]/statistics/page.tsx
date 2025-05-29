import { getStatlineAverage } from "@/api/statline";
import StatisticsBlock from "@/features/statistics";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: SearchParams;
  params: Promise<{ teamId: string }>;
};

async function StatisticsPage({ params }: PageProps) {
  const { teamId } = await params;

  const statsList = await getStatlineAverage(
    teamId,
    new Date("2025-05-01"),
    new Date("2025-06-01"),
  );

  return <StatisticsBlock statsList={statsList} />;
}
export default StatisticsPage;
