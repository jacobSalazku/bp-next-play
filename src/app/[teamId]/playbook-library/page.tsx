import { getGames, getPractices } from "@/api/activity";
import { getGameplan, getPlays, getPracticePreparations } from "@/api/play";
import { getRole } from "@/api/role";
import withAuth from "@/features/auth/components/with-auth";
import PlaybookBookBlock from "@/features/play-book/components/playbook";
import PlaybookLibrarySkeleton from "@/features/play-book/components/skeleton/playb-book-library-skeleton";
import GamePlanForm from "@/features/play-book/form/gameplan-form";
import PracticePreparationForm from "@/features/play-book/form/practice-preparation-form";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ teamId: string }>;
};

async function PlaybookPage({ params }: PageProps) {
  const { teamId } = await params;
  const playbook = await getPlays(teamId);
  const games = await getGames(teamId);
  const gameplan = await getGameplan(teamId);
  const practices = await getPractices(teamId);
  const practicePreparation = await getPracticePreparations(teamId);
  const role = await getRole();

  return (
    <Suspense fallback={<PlaybookLibrarySkeleton />}>
      <div className="scrollbar-none h-auto max-w-screen-2xl overflow-y-auto">
        <PlaybookBookBlock
          practicePreparation={practicePreparation}
          practices={practices}
          role={role}
          playbook={playbook}
          gamePlan={gameplan}
        />

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
    </Suspense>
  );
}

export default withAuth(PlaybookPage);
