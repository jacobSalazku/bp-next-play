import { getPlays } from "@/api/play";
import PlaybookBookBlock from "@/features/play-book/components/playbook";

type PageProps = {
  params: Promise<{ teamId: string }>;
};

async function PlaybookPage({ params }: PageProps) {
  const { teamId } = await params;
  const playbook = await getPlays(teamId);

  return <PlaybookBookBlock playbook={playbook} />;
}

export default PlaybookPage;
