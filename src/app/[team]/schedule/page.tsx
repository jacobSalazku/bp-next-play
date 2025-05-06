import { ScheduleBlock } from "@/features/schedule";
import { api } from "@/trpc/server";

export default async function SchedulePage() {
  const team = await api.team.getTeam();
  const activities = await api.activity.getActivities({ teamId: team.id });

  return <ScheduleBlock activities={activities} team={team.id} />;
}
