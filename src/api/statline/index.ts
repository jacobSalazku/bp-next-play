import type { StatSelect } from "@/features/statistics/types";
import { api } from "@/trpc/server";
import { cache } from "react";

export const getSinglePlayerStatline = cache(
  async (
    teamMemberId: string,
    activityId: string,
    stat: StatSelect,
    startDate: Date,
    endDate: Date,
  ) => {
    const statline = await api.stats.getSingleStat({
      teamMemberId,
      activityId,
      stat,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });
    return statline;
  },
);

export const getStatlineAverage = cache(
  async (
    teamMemberId: string,
    activityId: string,
    startDate: Date,
    endDate: Date,
  ) => {
    const statline = await api.stats.getStatlineAverage({
      teamMemberId: teamMemberId,
      activityId: activityId,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });
    return statline;
  },
);
