import SignOut from "@/components/sign-out";
import { api } from "@/trpc/server";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Home() {
  let user;

  try {
    user = await api.user.getUser();
  } catch (error) {
    console.error("Error fetching user:", error);
    return redirect("/login");
  }

  if (!user?.teamMember) {
    return redirect("/create");
  }

  const members = await api.user.getTeamMembers({
    teamId: user.teamMember.team.id,
  });

  return (
    <main className="min-h-screen bg-gray-900 py-12 text-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              Welcome, {user.user?.name}
            </h1>
            <p className="text-gray-400">
              {user.user?.email} - Role: {user.teamMember.role}
            </p>
          </div>
          <nav className="flex w-1/3 items-center space-x-4">
            <Link
              href="/team/create-team"
              className="mr-2 inline-flex w-full justify-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Create Team
            </Link>
            <SignOut />
            <Link
              href="/team/join-team"
              className="mr-2 inline-flex w-full justify-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Join Team
            </Link>
          </nav>
        </header>

        {/* Team Members Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Team Members</h2>
          {members && members.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-lg bg-gray-800 p-4 shadow-md"
                >
                  <h3 className="mb-2 text-lg font-semibold">
                    {member.user.name}
                  </h3>
                  <p className="mb-2 text-gray-400">{member.user.email}</p>
                  <div className="text-sm text-gray-500">
                    Role: {member.role}
                  </div>
                  <div className="text-sm text-gray-500">
                    Status: {member.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No team members found.</p>
          )}
        </section>

        {/* Additional Sections (Team List, etc.) */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Your Teams</h2>
          {/* <Teamlist role={user.teamMember.role} /> */}
        </section>
      </div>
    </main>
  );
}

export default Home;
