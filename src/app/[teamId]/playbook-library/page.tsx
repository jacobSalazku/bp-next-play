import PlaybookLibraryPage from "@/features/play-book/components/playbook-library";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ teamId: string }>;
};

async function PlaybookPage({ params, searchParams }: PageProps) {
  return <PlaybookLibraryPage />;
}

export default PlaybookPage;
