import { getGamePlanById } from "@/api/play";
import { gameplanSearchParamsCache } from "@/utils/search-params";

type PageProps = {
  searchParams: Promise<{ id: string }>;
};

async function GamePlanView({ searchParams }: PageProps) {
  const { id } = await gameplanSearchParamsCache.parse(searchParams);
  const gameplan = await getGamePlanById(id);

  if (!gameplan) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Gameplan not found</h1>
      </div>
    );
  }

  return (
    <div className="scrollbar-none h-screen overflow-y-auto pt-10">
      <div className="mx-auto max-w-7xl md:px-4">
        <h1 className="font-righteous mb-4 text-3xl font-bold text-white">
          Game Plan
        </h1>

        <div className="flex flex-col p-0 sm:relative sm:flex-row sm:items-start md:gap-8">
          <div className="top-4 right-0 mb-4 w-full sm:absolute sm:mb-0 sm:w-3/7"></div>

          <div
            className="prose prose-invert prose-h1:text-2xl prose-ul:py-0 prose-li:py-0 prose-strong:font-extrabold prose-h2:text-lg max-w-none rounded p-4 text-white"
            dangerouslySetInnerHTML={{ __html: gameplan.notes ?? "" }}
          />
        </div>
      </div>
    </div>
  );
}

export default GamePlanView;
