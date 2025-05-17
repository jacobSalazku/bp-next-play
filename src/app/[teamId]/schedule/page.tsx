import { getTeamActivities } from "@/api/team";
import { ScheduleBlock } from "@/features/schedule";

import { redirect } from "next/navigation";

export default async function SchedulePage({
  params,
}: {
  params: { teamId: string };
}) {
  const { teamId } = params;
  console.log("SchedulePage slug", teamId);
  const { team, activities } = await getTeamActivities(teamId);

  if (!team) {
    redirect("/create-team");
  }

  return <ScheduleBlock activities={activities} team={team} />;
}
