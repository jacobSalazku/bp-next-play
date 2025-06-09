import { getGames, getPractices } from "@/api/activity";
import { getGameplan, getPlays } from "@/api/play";
import { getRole } from "@/api/role";
import PlaybookBookBlock from "@/features/play-book/components/playbook";
import GamePlanForm from "@/features/play-book/form/gameplan-form";
import PracticePreparationForm from "@/features/play-book/form/practice-preparation-form";

type PageProps = {
  params: Promise<{ teamId: string }>;
};

async function PlaybookPage({ params }: PageProps) {
  const { teamId } = await params;
  const playbook = await getPlays(teamId);
  const games = await getGames(teamId);
  const gameplan = await getGameplan(teamId);
  const practices = await getPractices(teamId); 
  const role = await getRole();
  return (
    <div className="scrollbar-none h-auto max-w-screen-2xl overflow-y-auto">
      <PlaybookBookBlock playbook={playbook} gamePlan={gameplan} />
      <GamePlanForm
        mode="create"
        role={role}
        games={games}
        playbook={playbook}
      />
      <PracticePreparationForm
        mode="create"
        role={role}
        practices={practices}
        playbook={playbook}
      />
    </div>
  );
}

export default PlaybookPage;
