import { getTeamActivities } from "@/api/team";
import withAuth from "@/features/auth/components/with-auth";
import { ScheduleBlock } from "@/features/schedule";

import { redirect } from "next/navigation";

async function SchedulePage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  const { team, activities } = await getTeamActivities(teamId);

  if (!team) {
    redirect("/create-team");
  }

  return <ScheduleBlock activities={activities} team={team} />;
}
export default withAuth(SchedulePage);
