import { useEffect, useState } from "react";

import { Button } from "@/components/button/button";
import { cn } from "@/lib/utils";
import { addDays, format, isSameDay, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  time: string;
  type: "game" | "practice";
  duration?: number;
}

type HorizontalCalendarProps = {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  activities: Activity[];
  className?: string;
};

export function HorizontalCalender({
  selectedDate,
  onDateSelect,
  activities,
  className,
}: HorizontalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [visibleDays, setVisibleDays] = useState<Date[]>([]);

  useEffect(() => {
    const days = Array.from({ length: 7 }, (_, i) =>
      addDays(subDays(currentDate, 3), i),
    );
    setVisibleDays(days);
  }, [currentDate]);

  const handlePrevious = () =>
    setCurrentDate((prevDate) => subDays(prevDate, 7));
  const handleNext = () => setCurrentDate((prevDate) => addDays(prevDate, 7));

  // Function to check if a date has activities
  const getActivityTypeForDate = (date: Date) => {
    const activitiesForDate = activities.filter((activity) =>
      isSameDay(date, new Date(activity.time)),
    );

    if (activitiesForDate.length === 0) return null;
    if (activitiesForDate.length > 1) return "multiple";
    return activitiesForDate[0]?.type ?? null;
  };

  return (
    <div
      className={cn(
        "w-full rounded-3xl bg-gray-900 p-4 shadow-2xl transition-colors duration-300",
        "md:p-6",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-gray-100">
          {format(visibleDays[0] ?? new Date(), "MMM d")} -{" "}
          {format(visibleDays[6] ?? new Date(), "MMM d, yyyy")}
        </h2>
        <div className="flex space-x-2">
          <Button
            onClick={handlePrevious}
            className="rounded-full bg-blue-600 p-1 text-white shadow-md transition-colors duration-200 hover:bg-blue-700"
            aria-label="Previous Week"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button
            onClick={handleNext}
            className="rounded-full bg-blue-600 p-1 text-white shadow-md transition-colors duration-200 hover:bg-blue-700"
            aria-label="Next Week"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {visibleDays.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const activityType = getActivityTypeForDate(day);

          let dayTextColor = "text-gray-300";
          if (isSelected) {
            dayTextColor = "text-white";
          } else if (isToday) {
            dayTextColor = "text-blue-400";
          }

          return (
            <div
              key={index}
              onClick={() => onDateSelect?.(day)}
              className={cn(
                "group flex h-16 w-full cursor-pointer flex-col items-center justify-center rounded-xl transition-all duration-200",
                "md:h-24",
                isSelected
                  ? "border-2 border-blue-700 bg-blue-700 shadow-lg ring-2 ring-blue-500"
                  : "border border-gray-700 hover:bg-gray-800",
                "focus:ring-2 focus:ring-blue-500 focus:outline-none",
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium tracking-wide",
                  dayTextColor,
                  "group-hover:text-gray-100",
                )}
              >
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "text-lg font-bold",
                  dayTextColor,
                  "group-hover:text-gray-100",
                )}
              >
                {format(day, "d")}
              </span>

              {/* Activity Indicator */}
              {activityType && (
                <span
                  className={cn(
                    "mt-1 h-2 w-2 rounded-full",
                    activityType === "game" && "bg-yellow-500",
                    activityType === "practice" && "bg-blue-500",
                    activityType === "multiple" && "bg-red-500",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
