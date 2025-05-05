import { api } from "@/trpc/server";
import TeamCard from "./card/team-card";

const Teamlist = async ({ role }: { role?: string }) => {
  const teams = await api.team.getTeams();

  return (
    <div className="mx-auto w-full">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Teams im a part of
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* {teams.map((team) => (
          <Link
            href={`/team/${team.name}/schedule`}
            key={team.code}
            className="block overflow-hidden rounded-lg bg-white shadow-md transition duration-300 hover:shadow-xl"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {team.name}
              </h2>
              <p className="text-sm text-black">Your Role: {role}</p>
            </div>
          </Link>
        ))} */}
        {teams.map((team) => (
          <TeamCard key={team.code} team={team} />
        ))}
      </div>
    </div>
  );
};

export default Teamlist;
