import { api } from "@/trpc/server";
import { cache } from "react";

export const getPlays = cache(async (teamId: string) => {
  const plays = await api.play.getAllPlays({ teamId });

  return plays;
});

export const getGameplan = cache(async (teamId: string) => {
  const gameplan = await api.play.getGameplan({ teamId });

  return gameplan;
});
