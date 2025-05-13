import { PlayerBoxScore } from "@/features/scouting/components/multi-stats-tracker";
import { getTeamMember } from "@/features/scouting/lib/get-team-member";

async function PlayerPage() {
  const { members } = await getTeamMember();

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
    <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex h-screen max-h-[1024px] w-full max-w-6xl flex-row items-center justify-center border-2">
        <PlayerBoxScore players={members} />
      </div>
    </main>
  );
}
export default PlayerPage;
