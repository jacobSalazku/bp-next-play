import { getActiveTeamMember } from "@/api/user";
import { MultiStatlineTracker } from "@/features/scouting/components/multi-statline-tracker";
import { boxScoreSearchParamsCache } from "@/utils/search-params";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ teamId: string }>;
};

async function PlayerPage({ params, searchParams }: PageProps) {
  const { teamId } = await params;
  const { activityId } = await boxScoreSearchParamsCache.parse(searchParams);
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
    <div className="flex min-h-screen w-full flex-col items-center justify-start text-white">
      <div className="flex h-screen max-h-[1024px] w-full max-w-6xl flex-row justify-center py-4">
        <MultiStatlineTracker activityId={activityId} players={players} />
      </div>
    </div>
  );
}
export default PlayerPage;
