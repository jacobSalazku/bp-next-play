import { CreatePlay } from "@/features/play-book/create-play/create-play-form";

async function PlayPage() {
  return (
    <div className="scrollbar-none flex overflow-y-auto">
      <CreatePlay />
    </div>
  );
}

export default PlayPage;
