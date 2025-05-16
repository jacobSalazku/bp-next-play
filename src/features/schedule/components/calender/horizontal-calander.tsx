"use client";

import { Button } from "@/components/button/button";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { TeamInformation } from "@/types";
import { cn } from "@/utils/tw-merge";
import type { Activity } from "@prisma/client";
import { addDays, format, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { CalendarDay } from "./calendar-day";

type HorizontalCalendarProps = {
  activities: Activity[];
  team: TeamInformation;
};

export function HorizontalCalender({ activities }: HorizontalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const isMobile = useIsMobile();

  const visibleDays = useMemo(() => {
    const offset = isMobile ? 1 : 2;
    const length = isMobile ? 3 : 5;
    return Array.from({ length }, (_, i) =>
      addDays(subDays(currentDate, offset), i),
    );
  }, [currentDate, isMobile]);

  const handlePrevious = () =>
    setCurrentDate((prevDate) => subDays(prevDate, isMobile ? 3 : 5));
  const handleNext = () =>
    setCurrentDate((prevDate) => addDays(prevDate, isMobile ? 3 : 5));

  return (
    <div className="w-full rounded-3xl border border-gray-500 bg-gray-950 p-3 shadow-2xl transition-colors duration-300 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-gray-100">
          {format(visibleDays[0] ?? new Date(), "MMM d")} -{" "}
          {format(
            visibleDays[visibleDays.length - 1] ?? new Date(),
            "MMM d, yyyy",
          )}
        </h2>
        <div className="flex space-x-2">
          <Button
            onClick={handlePrevious}
            className="rounded-full p-1 text-white shadow-md transition-colors duration-200"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button
            onClick={handleNext}
            className="rounded-full p-1 text-white shadow-md transition-colors duration-200"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
      <div
        className={cn("grid gap-1", isMobile ? "grid-cols-3" : "grid-cols-5")}
      >
        {visibleDays.map((day, index) => (
          <CalendarDay key={index} day={day} activities={activities} />
        ))}
      </div>
    </div>
  );
}
