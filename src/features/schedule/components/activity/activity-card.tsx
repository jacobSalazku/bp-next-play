"use client";

import { Button } from "@/components/foundation/button/button";
import { Link } from "@/components/foundation/button/link";
import { useTeam } from "@/context/team-context";
import { cn } from "@/lib/utils";
import useStore from "@/store/store";
import type { Activity, UserTeamMember } from "@/types";
import { getActivityStyle } from "@/utils";
import { ActivityType } from "@prisma/client";
import { Clock } from "lucide-react";
import { type FC } from "react";

type ActivityCardProps = {
  activity: Activity;
  member: UserTeamMember;
};

export const ActivityCard: FC<ActivityCardProps> = ({ activity, member }) => {
  const { teamSlug } = useTeam();

  const {
    setOpenPracticeDetails,
    setOpenGameDetails,
    setSelectedActivity,
    setOpenGameAttendance,
    setOpenPracticeAttendance,
  } = useStore();

  const { bgColor, textColor, Icon } = getActivityStyle(activity.type);
  const role = member?.role === "COACH";

  const handleViewDetails = () => {
    setSelectedActivity(activity);
    if (activity.type === ActivityType.GAME) {
      setOpenGameDetails(true);
    } else if (activity.type === ActivityType.PRACTICE) {
      setOpenPracticeDetails(true);
    }
  };

  const handleAttendance = () => {
    setSelectedActivity(activity);
    if (activity.type === ActivityType.GAME) {
      setOpenGameAttendance(true);
    } else {
      setOpenPracticeAttendance(true);
    }
  };

  return (
    <div className="group flex flex-col gap-4 rounded-lg border border-gray-800 bg-gray-950 p-4 transition-all hover:border-gray-700 hover:shadow-md sm:flex-row sm:items-center sm:gap-6">
      <div className="flex flex-row items-start gap-4 sm:gap-6">
        <div
          className={cn(
            bgColor,
            textColor,
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl lg:h-14 lg:w-14",
          )}
        >
          <Icon className="h-5 w-5 lg:h-7 lg:w-7" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white">
            {activity.title}
          </h3>
          <div className="mt-1 flex items-center text-sm text-gray-400">
            <Clock className="mr-1 h-4 w-4" />
            {activity.time} ({activity.duration} hr
            {activity.duration !== 1 ? "s" : ""})
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:items-center">
        {activity.type === ActivityType.GAME && role && (
          <Link
            aria-label="Create Box Score"
            href={{
              pathname: `/${teamSlug}/schedule/box-score`,
              query: { activityId: activity.id },
            }}
            size="sm"
            variant="default"
            className="w-full sm:w-auto"
          >
            Create Box Score
          </Link>
        )}
        {!role && (
          <Button
            aria-label="Attendance"
            onClick={handleAttendance}
            size="sm"
            variant="default"
            className="w-full sm:w-auto"
          >
            Attendance
          </Button>
        )}
        <Button
          aria-label="View Details"
          onClick={handleViewDetails}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
