"use client";

import { Button } from "@/components/button/button";
import { cn } from "@/lib/utils";
import type { Activity } from "@prisma/client";
import { format, isSameDay } from "date-fns";
import { AlertCircle, CalendarClock, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import GameForm from "../form/game-form";
import PracticeForm from "../form/practice-form";
import { ActivityCard } from "./activity-card";
import { ActivityFilter } from "./activity-filter";

type ActivityListProps = {
  selectedDate: Date;
  className?: string;
  activities: Activity[];
  team: string;
};

export function ActivityList({
  selectedDate,
  className,
  activities,
  team,
}: ActivityListProps) {
  const [openGameModal, setOpenGameModal] = useState(false);
  const [openPracticeModal, setOpenPracticeModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "game" | "practice">("all");

  const filteredActivities = useMemo(() => {
    const activitiesForDay = activities.filter((activity) =>
      isSameDay(new Date(activity.date), selectedDate),
    );

    if (filter === "all") return activitiesForDay;
    return activitiesForDay.filter(
      (activity) => activity.type.toLowerCase() === filter,
    );
  }, [activities, selectedDate, filter]);

  return (
    <div className={cn("animate-fade-in mt-6 duration-300", className)}>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="flex items-center text-xl font-semibold text-white">
          <CalendarClock className="mr-2 h-5 w-5 text-gray-400" />
          Activities for {format(selectedDate, "MMMM d, yyyy")}
        </h2>
        <ActivityFilter
          currentFilter={filter}
          onFilterChange={(newFilter) => setFilter(newFilter)}
        />
      </div>

      {filteredActivities.length > 0 ? (
        <div className="mb-6 space-y-4">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onViewDetails={() => {
                console.log("View details clicked", activity);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-dashed border-gray-700 bg-gray-800 py-12 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-gray-400 opacity-50" />
          <p className="text-gray-400">No activities scheduled for this day</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setOpenGameModal(true)}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Activity
          </Button>
        </div>
      )}
      {openGameModal && (
        <GameForm
          onClose={() => setOpenGameModal(false)}
          selectedDate={selectedDate}
          team={team}
        />
      )}
      {openPracticeModal && (
        <PracticeForm
          onClose={() => setOpenPracticeModal(false)}
          selectedDate={selectedDate}
          team={team}
        />
      )}
      <div className="w-full justify-center">
        <Button
          onClick={() => setOpenGameModal(true)}
          type="button"
          variant="outline"
          className="w-1/2"
        >
          Create Game
        </Button>
        <Button
          onClick={() => setOpenPracticeModal(true)}
          type="button"
          variant="outline"
          className="w-1/2"
        >
          Create Practice
        </Button>
      </div>
    </div>
  );
}
