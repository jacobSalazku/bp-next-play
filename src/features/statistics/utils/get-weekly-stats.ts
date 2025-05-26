import { getSinglePlayerStatline } from "@/api/statline";
import type { StatSelect } from "../types";

export const fetchActivityStats = async (
  teamMemberId: string,
  activityId: string,
  stat: StatSelect,
  startDate: Date,
  endDate: Date,
) => {
  const rawStats = await getSinglePlayerStatline(
    teamMemberId,
    activityId,
    stat,
    startDate,
    endDate,
  );

  return rawStats;
};
