import { getTeams } from "@/api/team";
import TeamCard from "./card/team-card";
import { Link } from "./foundation/button/link";

const Teamlist = async () => {
  const { teams } = await getTeams();

  if (!teams) {
    return null;
  }
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 px-4 py-8">
      {teams.length > 0 ? (
        <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.code} team={team} />
          ))}
        </div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center gap-10">
          <h2 className="font-righteous text-4xl text-white">
            You are not part of any team
          </h2>
          <div className="inline-flex gap-6">
            <Link href="/create/create-team" size="lg" variant="outline">
              Create Team
            </Link>
            <Link
              href="/create/join-team"
              size="lg"
              className="mr-2 inline-flex justify-center bg-[#DCE6F1] px-4 py-2 font-medium text-gray-900 hover:brightness-90"
            >
              Request to Join
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teamlist;
