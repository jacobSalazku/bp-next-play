import { getPlayById } from "@/api/play";
import { practiceSearchParamsCache } from "@/utils/search-params";
import type { Metadata } from "next";

type PageProps = {
  searchParams: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Practice Preparation",
  description: "Prepare for your next practice with detailed instructions.",
  openGraph: {
    title: "Practice Preparation",
    description: "Prepare for your next practice with detailed instructions.",
  },
};

async function PracticePreparationView({ searchParams }: PageProps) {
  const { id } = await practiceSearchParamsCache.parse(searchParams);
  const practicePreparation = await getPlayById(id);

  if (!practicePreparation) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-white">
        <h1 className="text-2xl font-bold">
          No Practice Preparation Available
        </h1>
      </div>
    );
  }

  return (
    <div className="scrollbar-none h-screen overflow-y-auto pt-10">
      <div className="mx-auto max-w-7xl md:px-4">
        <h1 className="font-righteous mb-4 text-3xl font-bold text-white">
          Practice Preparation
        </h1>

        <div className="flex flex-col p-0 sm:relative sm:flex-row sm:items-start md:gap-8">
          <div className="top-4 right-0 mb-4 w-full sm:absolute sm:mb-0 sm:w-3/7">
            {/* <Image
              src={play?.canvas}
              alt={play.name}
              className="h-auto w-full rounded-xl border-2 object-cover"
              width={600}
              height={400}
            /> */}
          </div>

          <div
            className="prose prose-invert prose-h1:text-2xl prose-ul:py-0 prose-li:py-0 prose-strong:font-extrabold prose-h2:text-lg max-w-none rounded p-4 text-white"
            dangerouslySetInnerHTML={{
              __html: practicePreparation.description ?? "",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PracticePreparationView;
