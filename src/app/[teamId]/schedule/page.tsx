import { getTeamActivities } from "@/api/team";
import withAuth from "@/features/auth/components/with-auth";
import { ScheduleBlock } from "@/features/schedule";
import { ScheduleSkeleton } from "@/features/schedule/components/schedule-skeleton";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_BASE_URL ?? ""),
  title: "Schedule ",
  description: "Schedule your team's activities and view their statistics.",
  openGraph: {
    title: "Schedule",
    description: "Schedule your team's activities and view their statistics.",
  },
};

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
