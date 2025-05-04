import { JoinTeamForm } from "@/features/auth/components/join-form";

async function JoinTeamPage() {
  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-row items-center justify-center border-2">
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white px-4">
          <h2 className="font-righteous text-4xl tracking-wide text-neutral-500">
            To continue
          </h2>
          <JoinTeamForm />
        </div>
      </div>
    </main>
  );
}

export default JoinTeamPage;
