import "server-only";

import { api } from "@/trpc/server";
import { cache } from "react";

export const getPlays = cache(async (teamId: string) => {
  const plays = await api.play.getAllPlays({ teamId });

  return plays;
});

export const getGameplan = cache(async (teamId: string) => {
  const gameplan = await api.gameplan.getGameplan({ teamId });

  return gameplan;
});

export const getPlayById = cache(async (id: string) => {
  const play = await api.play.getPlayById({ id });

  return play;
});

export const getGamePlanById = cache(async (id: string) => {
  const game = await api.gameplan.getGamePlanById({ id });

  return game;
});

export const getPracticeById = cache(async (id: string) => {
  const practice = await api.practice.getPracticePreparationById({ id });

  return practice;
});
