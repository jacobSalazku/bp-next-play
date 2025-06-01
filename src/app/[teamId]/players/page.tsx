import { getTeam } from "@/api/team";
import { getTeamMembers } from "@/api/user";

import { PlayerBlock } from "@/features/player-table";

async function PlayerPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const { team } = await getTeam(teamId);
  const members = await getTeamMembers(team.id);

  return (
    <div className="flex min-h-screen flex-col items-center overflow-auto text-white">
      {!members || members.length === 0 ? (
        <>
          <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-row items-center justify-center border">
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-4">
              <div> No players found</div>
            </div>
          </div>
        </>
      ) : (
        <PlayerBlock members={members} team={team} />
      )}
    </div>
  );
}
export default PlayerPage;
