"use client";

import { Button } from "@/components/button/button";
import { cn } from "@/lib/utils";
import type { Activity } from "@prisma/client";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarClock,
  Clock,
  Plus,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import GameForm from "../form/game-form";
import PracticeForm from "../form/practice-form";

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
    if (filter === "all") return activities;
    return activities.filter((activity) => activity.type === filter);
  }, [activities, filter]);

  return (
    <div className={cn("animate-fade-in mt-6 duration-300", className)}>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="flex items-center text-xl font-semibold text-white">
          <CalendarClock className="mr-2 h-5 w-5 text-gray-400" />
          Activities for {format(selectedDate, "MMMM d, yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-gray-700">
            {["all", "game", "practice"].map((type) => (
              <Button
                key={type}
                variant={filter === type ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(type as "game" | "practice" | "all")}
                className="rounded-none"
              >
                {type === "game" ? (
                  <Trophy className="mr-1 h-4 w-4" />
                ) : (
                  <Users className="mr-1 h-4 w-4" />
                )}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filteredActivities.length > 0 ? (
        <div className="mb-6 space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="group flex flex-col rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center"
            >
              <div
                className={cn(
                  "mr-4 flex h-12 w-12 items-center justify-center rounded-xl",
                  activity.type === "game"
                    ? "bg-yellow-900 text-yellow-300"
                    : "bg-blue-900 text-blue-300",
                )}
              >
                {activity.type === "game" ? (
                  <Trophy className="h-6 w-6" />
                ) : (
                  <Users className="h-6 w-6" />
                )}
              </div>
              <div className="mt-3 flex-1 sm:mt-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <h3 className="font-semibold text-white">{activity.title}</h3>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-400">
                  <Clock className="mr-1 h-4 w-4" /> {activity.time} (
                  {activity.duration} hr{activity.duration !== 1 ? "s" : ""})
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 sm:mt-0 sm:ml-2"
              >
                View Details
              </Button>
            </div>
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
