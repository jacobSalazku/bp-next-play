"use client";

import { Button } from "@/components/button/button";
import { Link } from "@/components/button/link";
import { useTeam } from "@/context/team-context";
import { useRole } from "@/hooks/use-role";
import useStore from "@/store/store";
import type { Activity, TeamInformation } from "@/types";
import { getActivityStyle } from "@/utils";
import { cn } from "@/utils/tw-merge";

import { Clock } from "lucide-react";
import { type FC } from "react";

type ActivityCardProps = {
  activity: Activity;
  team: TeamInformation;
};

export const ActivityCard: FC<ActivityCardProps> = ({ activity }) => {
  const { teamSlug } = useTeam();
  const { role } = useRole();

  const {
    selectedActivity,
    setOpenPracticeDetails,
    setOpenGameDetails,
    setSelectedActivity,
    setOpenGameAttendance,
    setOpenPracticeAttendance,
  } = useStore();

  const { bgColor, textColor, Icon } = getActivityStyle(activity.type);

  const handleViewDetails = () => {
    setSelectedActivity(activity);
    if (activity.type === "Game") {
      setOpenGameDetails(true);
    } else if (activity.type === "Practice") {
      setOpenPracticeDetails(true);
    }
  };

  const handleAttendance = () => {
    setSelectedActivity(activity);
    if (activity.type === "Game") {
      setOpenGameAttendance(true);
    } else {
      setOpenPracticeAttendance(true);
    }
  };

  const boxScoreSearchParams = new URLSearchParams();
  boxScoreSearchParams.set("activityId", activity.id);

  if (!role) return null;
  return (
    <>
      <div className="group flex flex-col rounded-sm border border-gray-800 p-4 shadow-sm transition-all hover:border-gray-700 hover:shadow-md sm:flex-row sm:items-center">
        <div
          className={cn(
            bgColor,
            textColor,
            "mr-4 flex h-16 w-16 items-center justify-center rounded-xl",
          )}
        >
          {<Icon className="h-8 w-9" />}
        </div>
        <div className="mt-3 flex-1 sm:mt-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <h3 className="font-semibold text-white">{activity.title}</h3>
          </div>
          <div className="mt-1 flex items-center text-sm text-gray-400">
            <Clock className="mr-1 h-4 w-4" />
            {activity.time} ({activity.duration} hr
            {activity.duration !== 1 ? "s" : ""})
          </div>
        </div>
        <div>
          {activity.type === "Game" && role === "COACH" && (
            <Link
              href={{
                pathname: `/${teamSlug}/box-score`,
                query: { activityId: activity.id },
              }}
              size="sm"
              variant="default"
              className="py-2"
            >
              Create Box Score
            </Link>
          )}
          {role === "PLAYER" && (
            <Button
              onClick={handleAttendance}
              size="sm"
              variant="default"
              className="py-2"
            >
              Attendance
            </Button>
          )}
          <Button
            onClick={handleViewDetails}
            variant="outline"
            size="sm"
            className="mt-3 sm:mt-0 sm:ml-2"
          >
            View Details
          </Button>
        </div>
      </div>
    </>
  );
};
