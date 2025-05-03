import { WithAuth } from "@/components/auth";
import { api } from "@/trpc/server";

import Link from "next/link";
import { redirect } from "next/navigation";

async function CreatePage() {
  const user = await api.user.getUser();

  if (user.teamMember && Object.keys(user.teamMember).length > 0) {
    return redirect("/");
  }

  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-row items-center justify-center border-2">
        <div className="flex h-full w-full flex-col items-center justify-center gap-12 bg-white px-4 py-16">
          <h2 className="text-4xl text-neutral-500"> Log in bij NextPlay</h2>
          <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
            <Link
              href="/create/create-team"
              className="hover:bg-opacity-25 flex w-80 justify-center rounded-md border border-black px-2 py-4 text-sm text-neutral-500 hover:bg-white"
            >
              Create Team
            </Link>
            <Link
              href="/create/join-team"
              className="hover:bg-opacity-25 flex w-80 justify-center rounded-md border border-black px-2 py-4 text-sm text-neutral-500 hover:bg-white"
            >
              Request to Join
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default WithAuth(CreatePage);
