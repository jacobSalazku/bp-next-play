import { api } from "@/trpc/server";
import { cache } from "react";

export const getStatlineAverage = cache(
  async (teamId: string, startDate: Date, endDate: Date) => {
    const statline = await api.stats.getStatlineAverage({
      teamId: teamId,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });
    return statline;
  },
);
