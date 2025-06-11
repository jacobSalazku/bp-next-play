import CreatePlaySkeleton from "@/features/play-book/components/skeleton/create-play-skeleton";
import { PlayForm } from "@/features/play-book/form/play-form";
import { Suspense } from "react";

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
