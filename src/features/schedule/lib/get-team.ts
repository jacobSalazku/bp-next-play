import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

import { cache } from "react";

export const getTeamActivities = cache(async () => {
  const { user, teamMember } = await api.user.getUser();

  if (!user) {
    redirect("/login");
  }

  const team = await api.team.getTeam();

  const isFirstLogin = user.createdAt === user.updatedAt;

  if (!teamMember && isFirstLogin) {
    redirect("/create");
  }

  const activities = await api.activity.getActivities({ teamId: team.id });
  return { team, activities };
});
