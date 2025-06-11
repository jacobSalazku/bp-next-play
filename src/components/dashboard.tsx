import type { User } from "@/types";
import { User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "./foundation/button/button";
import { Link } from "./foundation/button/link";
import Teamlist from "./team-list";

const DashBoardBlock = ({ user }: { user: User["user"] }) => {
  return (
    <>
      <div className="flex h-screen bg-gray-950 text-white">
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/50 bg-gray-950 px-6 py-4 shadow">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="group relative">
              <button
                aria-label="dropdown settings"
                className="flex cursor-pointer items-center gap-2 rounded-full border border-white px-4 py-2 hover:bg-gray-600"
              >
                <UserIcon className="h-5 w-5" />
                <span>{user.name}</span>
              </button>
              <div className="absolute right-0 mt-2 hidden w-48 rounded-md bg-gray-800 p-2 shadow-lg group-hover:block">
                <Link
                  aria-label="join team"
                  href="/create/join-team"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Join Team
                </Link>
                <Link
                  aria-label="create team"
                  href="/create/create-team"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Create Team
                </Link>

                <Button
                  aria-label="logout"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="scrollbar-none flex-1 overflow-y-auto px-8 pt-8 pb-2">
            <section className="mb-12 flex flex-col gap-4 pt-12 pb-4 text-center">
              <h2 className="font-righteous mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                Welcome, to NextPlay {user.name}!
              </h2>
              <span className="text-2xl">Teamwork made easy. Let’s play!</span>
            </section>

            <section>
              <Teamlist />
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashBoardBlock;
