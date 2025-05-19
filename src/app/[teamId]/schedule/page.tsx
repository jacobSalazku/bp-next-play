import { getTeamActivities } from "@/api/team";
import { ScheduleBlock } from "@/features/schedule";

import { redirect } from "next/navigation";

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  console.log("SchedulePage slug", teamId);
  const { team, activities } = await getTeamActivities(teamId);

  if (!team) {
    redirect("/create-team");
  }

  return <ScheduleBlock activities={activities} team={team} />;
}
