import { api } from "@/trpc/react";
import { TeamMemberRole } from "@/types/enum";

export const useIsCoach = () => {
  const [user] = api.user.getUser.useSuspenseQuery();

  return user?.teamMember?.role === TeamMemberRole.COACH;
};
