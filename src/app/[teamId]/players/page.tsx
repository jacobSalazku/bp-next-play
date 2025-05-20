import { getTeam } from "@/api/team";
import { getTeamMembers } from "@/api/user";

import { PlayerBlock } from "@/features/player-table";

async function PlayerPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const { team } = await getTeam(teamId);
  const members = await getTeamMembers(team.id);

  if (!members || members.length === 0) {
    return (
      <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-row items-center justify-center border">
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white px-4">
            <div> No players found</div>
          </div>
        </div>
      </main>
    );
  }

  // Map members to match the expected User type for PlayerBlock

  return (
    <main className="max flex min-h-screen flex-col items-center text-white">
      <PlayerBlock members={members} team={team} />
    </main>
  );
}
export default PlayerPage;
