"use client";

import { cn } from "@/lib/utils";
import useStore from "@/store/store";
import type { Activity } from "@/types";

import { ActivityType } from "@prisma/client";
import { format, isSameDay } from "date-fns";
import type { FC, MouseEvent } from "react";
import { CalendarActivityButton } from "./calendar-activity-button";

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
    setSelectedActivity,
  } = useStore();

  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
  const isToday = isSameDay(day, new Date());

  const activitiesForDay = activities.filter((activity) =>
    isSameDay(new Date(activity.date), day),
  );

  const displayActivities = activitiesForDay.slice(0, 3);
  const extraActivitiesCount =
    activitiesForDay.length > 3 ? activitiesForDay.length - 3 : null;

  const OpenActivityDetailModal = (
    e: MouseEvent<HTMLButtonElement>,
    activity: Activity,
  ) => {
    // Prevent event bubbling
    e.stopPropagation();
    setSelectedActivity(activity);
    if (activity.type === ActivityType.GAME) {
      setOpenGameDetails(true);
    } else {
      setOpenPracticeDetails(true); // Open Practice details modal
    }
  };

  return (
    <div
      onClick={() => setSelectedDate(day)}
      className={cn(
        "group flex max-h-full min-h-40 w-full cursor-pointer flex-col items-end justify-start rounded-sm p-1.5 transition-all duration-200 focus:ring-2 focus:ring-white focus:outline-none md:p-2 lg:p-4 xl:h-[15rem]",
        isSelected
          ? "border border-white shadow-lg ring ring-white"
          : "border border-orange-200/30 hover:bg-orange-200/10",
      )}
    >
      <div className="inline-flex w-full flex-row items-center justify-between px-1">
        <span className="text-xs font-medium text-gray-400">
          {format(day, "EEE")}
        </span>
        <span
          className={cn(
            isToday ? "text-orange-300" : "text-gray-300",
            "mb-2 text-sm font-light md:text-lg lg:text-2xl",
          )}
        >
          {format(day, "d")}
        </span>
      </div>
      {displayActivities.map((activity) => (
        <CalendarActivityButton
          key={activity.id}
          activity={activity}
          onClick={OpenActivityDetailModal}
        />
      ))}
      {extraActivitiesCount && (
        <div className="text-center text-xs text-gray-400">
          +{extraActivitiesCount} more
        </div>
      )}
    </div>
  );
};
