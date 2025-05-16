import { getTeamActivities } from "@/api/team";
import { ScheduleBlock } from "@/features/schedule";

import { redirect } from "next/navigation";

export default async function SchedulePage() {
  const { team, activities } = await getTeamActivities();

  if (!team) {
    redirect("/create-team");
  }

  return <ScheduleBlock activities={activities} team={team} />;
}
