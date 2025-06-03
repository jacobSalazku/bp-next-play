import { getPlays } from "@/api/play";
import PlaybookLibraryPage from "@/features/play-book/components/playbook-library";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ teamId: string }>;
};

async function PlaybookPage({ params, searchParams }: PageProps) {
  const { teamId } = await params;
  const playbook = await getPlays(teamId);

  return <PlaybookLibraryPage playbook={playbook} />;
}

export default PlaybookPage;
