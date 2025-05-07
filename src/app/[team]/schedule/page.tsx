import { ScheduleBlock } from "@/features/schedule";
import { getTeamAndActivities } from "@/features/schedule/lib/get-team";
import { redirect } from "next/navigation";

export default async function SchedulePage() {
  const { team, activities } = await getTeamAndActivities();

  if (!team) {
    redirect("/create-team");
  }
  return <ScheduleBlock activities={activities} team={team.id} />;
}
