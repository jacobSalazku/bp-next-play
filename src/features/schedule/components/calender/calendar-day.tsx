import { cn } from "@/lib/utils";
import useStore from "@/store/store";
import type { Activity } from "@prisma/client";
import { format, isSameDay } from "date-fns";
import type { FC, MouseEvent } from "react";
import { getTypeBgColor } from "../../utils/utils";

type ActivityType = "Game" | "Practice" | "Multiple";

type CalendarDayProps = {
  day: Date;
  activities: Activity[];
};

export const CalendarDay: FC<CalendarDayProps> = ({ day, activities }) => {
  const {
    selectedDate,
    setSelectedDate,
    setOpenGameDetails,
    setOpenPracticeDetails,
  } = useStore();

  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
  const isToday = isSameDay(day, new Date());

  const activitiesForDay = activities.filter((activity) =>
    isSameDay(new Date(activity.date), day),
  );

  const displayActivities = activitiesForDay.slice(0, 3);
  const hasMoreActivities = activitiesForDay.length > 1;

  const OpenActivityDetailModal = (
    e: MouseEvent<HTMLButtonElement>,
    activity: Activity,
  ) => {
    e.stopPropagation();
    if (activity.type === "Game") {
      setOpenGameDetails(true);
    }
    if (activity.type === "Practice") {
      setOpenPracticeDetails(true);
    }
  };

  return (
    <div
      onClick={() => setSelectedDate(day)}
      className={cn(
        "group flex h-32 w-full cursor-pointer flex-col items-end justify-start rounded-sm p-1.5 transition-all duration-200 focus:ring-2 focus:ring-white focus:outline-none md:h-40",
        isSelected
          ? "border border-white shadow-lg ring ring-white"
          : "border border-gray-700 hover:bg-gray-800",
      )}
    >
      <span
        className={cn(
          "mb-2 text-lg font-bold",
          isSelected
            ? "text-white"
            : isToday
              ? "text-blue-400"
              : "text-gray-300",
        )}
      >
        {format(day, "d")}
      </span>

      <div className="w-full overflow-hidden">
        {displayActivities.map((activity) => (
          <button
            type="button"
            key={activity.id}
            onClick={(e) => OpenActivityDetailModal(e, activity)}
            className={cn(
              getTypeBgColor(activity.type as ActivityType),
              "mb-1 inline-flex w-full cursor-pointer items-center justify-between truncate rounded px-1 py-1 text-xs font-medium hover:opacity-90",
            )}
          >
            <div className="truncate">{activity.title}</div>
            <div className="text-xs opacity-90">{activity.time}</div>
          </button>
        ))}
        {hasMoreActivities && (
          <div className="text-center text-xs text-gray-400">
            +{activities.length - 1} more
          </div>
        )}
      </div>
    </div>
  );
};
