import { api } from "@/trpc/server";
import { cache } from "react";

export const getActivity = cache(async (activityId: string) => {
  const activity = await api.activity.getActivity({ activityId: activityId });

  return activity;
});
