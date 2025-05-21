import { getTeamMembers, getUser } from "@/api/user";
import Teamlist from "@/components/team-list";
import { redirect } from "next/navigation";

async function Dashboard() {
  const { user, teamMember } = await getUser();

  const members = teamMember ? await getTeamMembers(teamMember.team.id) : [];

  if (user.hasOnBoarded === false) {
    redirect("/create/onboarding");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
      <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-col items-center justify-center">
        <div className="w-full flex-1 overflow-y-auto p-20">
          <h1 className="font-righteous text-4xl text-[#DCE6F1]">NextPlay</h1>
          <header className="mt-4 mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Welcome, {user.name}!</h1>
              <p className="text-gray-400">
                {user.email} - Role: {teamMember?.role}
              </p>
            </div>
          </header>
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Your Teams
            </h2>
            <Teamlist />
          </section>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
