import CreatePlaySkeleton from "@/features/play-book/components/skeleton/create-play-skeleton";
import { PlayForm } from "@/features/play-book/form/play-form";
import { Suspense } from "react";

export const metadata = {
  title: "Create Play",
  description: "Create a new play for your team.",
  openGraph: {
    title: "Create Play",
    description: "Create a new play for your team.",
  },
};

async function PlayPage() {
  return (
    <div className="scrollbar-none flex overflow-y-auto">
      <Suspense fallback={<CreatePlaySkeleton />}>
        <PlayForm />
      </Suspense>
    </div>
  );
}

export default PlayPage;
