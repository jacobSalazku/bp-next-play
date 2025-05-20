import { getTeamMember } from "@/api/user";
import { PlayerBoxScore } from "@/features/scouting/components/multi-stats-tracker";
import { boxScoreSearchParamsCache } from "@/utils/search-params";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ teamId: string }>;
};

async function PlayerPage({ params, searchParams }: PageProps) {
  const { teamId } = await params;
  const { members } = await getTeamMember(teamId);

  const { activityId } = await boxScoreSearchParamsCache.parse(searchParams);
  console.log("activityId", activityId);

  if (!members) {
    return (
      <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-row items-center justify-center border-2">
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white px-4">
            <div> No players found</div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="max flex min-h-screen flex-col items-center justify-center text-white">
      <div className="flex h-screen max-h-[1024px] w-full max-w-6xl flex-row items-center justify-center">
        <PlayerBoxScore
          activityId={activityId}
          teamId={teamId}
          players={members}
        />
      </div>
    </main>
  );
}
export default PlayerPage;
