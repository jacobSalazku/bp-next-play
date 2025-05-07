import { Button } from "@/components/button/button";
import { cn } from "@/lib/utils";
import type { Activity } from "@prisma/client";
import { Clock } from "lucide-react";
import type { FC } from "react";
import { getActivityStyle } from "../../utils/utils";

type ActivityCardProps = {
  activity: Activity;
  onViewDetails: (activity: Activity) => void;
};

export const ActivityCard: FC<ActivityCardProps> = ({
  activity,
  onViewDetails,
}) => {
  const { bgColor, textColor, Icon } = getActivityStyle(activity.type);
  return (
    <div className="group flex flex-col rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center">
      <div
        className={cn(
          bgColor,
          textColor,
          "mr-4 flex h-12 w-12 items-center justify-center rounded-xl",
        )}
      >
        {<Icon className="h-6 w-6" />}
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

      <Button
        variant="outline"
        size="sm"
        className="mt-3 sm:mt-0 sm:ml-2"
        onClick={}
      >
        View Details
      </Button>
    </div>
  );
};
