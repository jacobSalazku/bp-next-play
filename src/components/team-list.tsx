import { api } from "@/trpc/server";
import TeamCard from "./card/team-card";

const Teamlist = async () => {
  const teams = await api.team.getTeams();

  return (
    <div className="mx-auto w-full">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <TeamCard key={team.code} team={team} />
        ))}
      </div>
    </div>
  );
};

export default Teamlist;
