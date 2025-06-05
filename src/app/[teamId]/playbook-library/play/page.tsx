import { PlayForm } from "@/features/play-book/form/play-form";

async function PlayPage() {
  return (
    <div className="scrollbar-none flex overflow-y-auto">
      <PlayForm />
    </div>
  );
}

export default PlayPage;
