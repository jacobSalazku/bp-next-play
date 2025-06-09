import "server-only";

import { api } from "@/trpc/server";
import { cache } from "react";

export const getActivity = cache(async (activityId: string) => {
  const activity = await api.activity.getActivity({ activityId: activityId });

  return activity;
});

export const getGames = cache(async (teamId: string) => {
  const games = await api.activity.getGames({ teamId: teamId });
  return games;
});

export const getPractices = cache(async (teamId: string) => {
  const practices = await api.activity.getPractices({ teamId: teamId });

  return practices;
});
