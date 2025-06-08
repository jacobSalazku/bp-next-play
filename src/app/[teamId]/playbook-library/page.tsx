import { getGames } from "@/api/activity";
import { getGameplan, getPlays } from "@/api/play";
import { getRole } from "@/api/role";
import PlaybookBookBlock from "@/features/play-book/components/playbook";
import GamePlanForm from "@/features/play-book/form/gameplan-form";

type PageProps = {
  params: Promise<{ teamId: string }>;
};

async function PlaybookPage({ params }: PageProps) {
  const { teamId } = await params;
  const playbook = await getPlays(teamId);
  const games = await getGames(teamId);
  const gameplan = await getGameplan(teamId);
  const role = await getRole();
  return (
    <div className="scrollbar-none overflow-y-auto">
      <PlaybookBookBlock playbook={playbook} gamePlan={gameplan} />
      <GamePlanForm
        mode="create"
        role={role}
        games={games}
        playbook={playbook}
      />
    </div>
  );
}

export default PlaybookPage;
