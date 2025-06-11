import { getTeamActivities } from "@/api/team";
import withAuth from "@/features/auth/components/with-auth";
import { ScheduleBlock } from "@/features/schedule";
import { ScheduleSkeleton } from "@/features/schedule/components/schedule-skeleton";

import { redirect } from "next/navigation";
import { Suspense } from "react";

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

  return (
    <Suspense fallback={<ScheduleSkeleton />}>
      <ScheduleBlock activities={activities} team={team} />
    </Suspense>
  );
}
export default withAuth(SchedulePage);
