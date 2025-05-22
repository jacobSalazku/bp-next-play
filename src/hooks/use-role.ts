import { api } from "@/trpc/react";

export const useRole = () => {
  const [data] = api.user.getUser.useSuspenseQuery();
  const teamId = data.teamMember?.team.id;

  const [role] = api.team.getTeamRole.useSuspenseQuery(
    teamId ? { teamId } : { teamId: "" },
  );

  return role;
};
