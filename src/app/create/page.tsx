import { Link } from "@/components/foundation/button/link";

async function CreatePage() {
  // if (user.teamMember && Object.keys(user.teamMember).length > 0) {
  //   return redirect("/");
  // }

  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex h-screen max-h-[1024px] w-full flex-row items-center justify-center border-2">
        <div className="flex h-full w-full flex-col items-center justify-center gap-12 bg-white px-4 py-16">
          <h2 className="font-righteous text-4xl text-neutral-500">
            To continue
          </h2>
          <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
            <Link href="/create/create-team">Create Team</Link>
            <Link href="/create/join-team">Request to Join</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CreatePage;
