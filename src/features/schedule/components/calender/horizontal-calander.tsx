"use client";

import { Button } from "@/components/button/button";
import { cn } from "@/lib/utils";
import type { Activity } from "@prisma/client";
import { addDays, format, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { CalendarDay } from "./calendar-day";

type HorizontalCalendarProps = {
  activities: Activity[];
  className?: string;
};

export function HorizontalCalender({
  activities,
  className,
}: HorizontalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const visibleDays = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) =>
      addDays(subDays(currentDate, 3), i),
    );
  }, [currentDate]); // Only recalculate when currentDate changes

  const handlePrevious = () =>
    setCurrentDate((prevDate) => subDays(prevDate, 7));
  const handleNext = () => setCurrentDate((prevDate) => addDays(prevDate, 7));

  return (
    <div
      className={cn(
        "w-full rounded-3xl border border-gray-500 bg-gray-950 p-3 shadow-2xl transition-colors duration-300",
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
      <div className="grid grid-cols-5 gap-1">
        {visibleDays.map((day, index) => (
          <CalendarDay key={index} day={day} activities={activities} />
        ))}
      </div>
    </div>
  );
}
