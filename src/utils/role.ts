import type { UserTeamMember } from "@/types";

export const getRoleById = (member: UserTeamMember) => {
  return member?.role === "COACH";
};
