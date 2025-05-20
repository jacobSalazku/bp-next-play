import { getTeamMembers, getUser } from "@/api/user";
import Teamlist from "@/components/team-list";
import { TeamMemberRole } from "@/types/enum";
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
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Team Members
            </h2>
            {members && members.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map(
                  (member) =>
                    (member.role as TeamMemberRole) !==
                      TeamMemberRole.COACH && (
                      <div
                        key={member.id}
                        className="rounded-lg border border-[#DCE6F1] bg-blue-900 p-4 shadow-sm"
                      >
                        <h3 className="mb-2 text-lg font-medium text-white">
                          {member.user.name}
                        </h3>
                        <p className="mb-2 text-gray-400">
                          {member.user.email}
                        </p>
                        <div className="text-sm text-gray-500">
                          Role: {member.role}
                        </div>
                        <div className="text-sm text-gray-500">
                          Status: {member.status}
                        </div>
                      </div>
                    ),
                )}
              </div>
            ) : (
              <p className="text-gray-400">No team members found.</p>
            )}
          </section>

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
