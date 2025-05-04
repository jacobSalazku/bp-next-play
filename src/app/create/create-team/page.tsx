import CreateTeamForm from "@/features/auth/components/team-form";

async function CreateTeamPage() {
  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-row items-center justify-center border-2">
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-white px-4">
          <h2 className="font-righteous text-4xl tracking-wide text-neutral-400">
            My Team
          </h2>
          <CreateTeamForm />
        </div>
      </div>
    </main>
  );
}
export default CreateTeamPage;
