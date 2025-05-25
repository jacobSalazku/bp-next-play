import { getActiveTeamMember } from "@/api/user";
import ChartsBlock from "@/features/charts";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ teamId: string }>;
};

async function StatisticsPage({ params }: PageProps) {
  const { teamId } = await params;
  const members = await getActiveTeamMember(teamId);

  const players = members.map((member) => ({
    ...member,
  }));
  return <ChartsBlock />;
}
export default StatisticsPage;
