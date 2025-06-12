import { getActivity } from "@/api/activity";
import { getRole } from "@/api/role";
import { getActiveTeamMember } from "@/api/user";
import withAuth from "@/features/auth/components/with-auth";
import Skeleton from "@/features/scouting/components/mobile/skeleton";
import { MultiStatlineTracker } from "@/features/scouting/components/multi-statline-tracker";
import { boxScoreSearchParamsCache } from "@/utils/search-params";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Box Score",
  description: "Box Score inserts your team's game statistics.",
  openGraph: {
    title: "Box Score",
    description: "Box Score inserts your team's game statistics.",
  },
};

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ teamId: string }>;
};

async function TeamBoxScores({ params, searchParams }: PageProps) {
  const role = await getRole();
  const { teamId } = await params;
  if (role !== "COACH") return redirect(`/${teamId}/schedule`);

  const { activityId } = await boxScoreSearchParamsCache.parse(searchParams);

  const activity = await getActivity(activityId);
  const members = await getActiveTeamMember(teamId);

  const players = members.map((member) => ({
    ...member,
  }));

  if (!members) {
    return (
      <main className="max scrollbar-none flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-row items-center justify-center border-2">
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white px-4">
            <div> No players found</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start overflow-y-auto text-white">
      <div className="flex h-screen max-h-[1024px] w-full max-w-6xl flex-row justify-center py-4">
        <Suspense fallback={<Skeleton />}>
          <MultiStatlineTracker activity={activity} players={players} />
        </Suspense>
      </div>
    </div>
  );
}
export default withAuth(TeamBoxScores);
