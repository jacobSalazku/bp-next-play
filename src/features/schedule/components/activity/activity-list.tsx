"use client";

import { Button } from "@/components/button/button";
import useStore from "@/store/store";
import type { TeamInformation } from "@/types";
import type { Activity } from "@prisma/client";
import { format, isSameDay } from "date-fns";
import { AlertCircle, CalendarClock, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import GameForm from "../form/game-form";
import PracticeForm from "../form/practice-form";
import { ActivityCard } from "./activity-card";
import { ActivityFilter } from "./activity-filter";

type ActivityListProps = {
  activities: Activity[];
  team: TeamInformation;
};

export function ActivityList({ activities, team }: ActivityListProps) {
  const {
    selectedDate,
    openGameModal,
    openGameDetails,
    setOpenGameModal,
    openPracticeModal,
    openPracticeDetails,
    setOpenPracticeModal,
    setOpenGameDetails,
    setOpenPracticeDetails,
  } = useStore();

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
    <div className="animate-fade-in mt-4 rounded-xl border p-6 shadow-sm duration-300">
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
        <div className="scrollbar-none mb-6 max-h-96 space-y-2 overflow-y-auto pr-2">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} team={team} />
          ))}
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-dashed border-gray-700 bg-gray-800 py-12 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-gray-400 opacity-50" />
          <p className="text-gray-400">No activities scheduled for this day</p>
          {
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setOpenGameModal(true)}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Activity
            </Button>
          }
        </div>
      )}
      {openGameModal && selectedDate && (
        <GameForm
          team={team}
          mode="create"
          onClose={() => setOpenGameModal(false)}
        />
      )}
      {openPracticeModal && selectedDate && (
        <PracticeForm
          team={team}
          mode="create"
          onClose={() => setOpenPracticeModal(false)}
        />
      )}
      {openGameDetails && (
        <GameForm
          team={team}
          mode="view"
          onClose={() => setOpenGameDetails(false)}
        />
      )}
      {openPracticeDetails && (
        <PracticeForm
          team={team}
          mode="view"
          onClose={() => setOpenPracticeDetails(false)}
        />
      )}
      <div className="mt-4 flex w-full justify-center gap-4">
        <Button
          onClick={() => setOpenGameModal(true)}
          type="button"
          variant="outline"
          className="w-1/2"
        >
          Create Game
        </Button>
        <Button
          onClick={() => {
            console.log("Create Practice button clicked");
            setOpenPracticeModal(true);
          }}
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
