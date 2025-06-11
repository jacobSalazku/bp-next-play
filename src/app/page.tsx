import { getUser } from "@/api/user";
import Teamlist from "@/components/team-list";
import ProfileDropDown from "@/features/auth/components/profile-dropdown";
import { redirect } from "next/navigation";

async function Dashboard() {
  const { user } = await getUser();

  if (user.hasOnBoarded === false) {
    redirect("/create/onboarding");
  }

  return (
    <>
      <div className="flex h-screen bg-gray-950 text-white">
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/50 bg-gray-950 px-6 py-4 shadow">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <ProfileDropDown />
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
}

export default Dashboard;
