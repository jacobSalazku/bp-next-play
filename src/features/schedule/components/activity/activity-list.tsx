"use client";

import { Button } from "@/components/foundation/button/button";
import AttendanceModal from "@/features/attendance/components/attendance-modal";
import useStore from "@/store/store";
import type { Activity, TeamInformation, UserTeamMember } from "@/types";
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
  member: UserTeamMember;
};

export function ActivityList({ activities, team, member }: ActivityListProps) {
  const {
    selectedDate,
    openGameModal,
    openGameDetails,
    openPracticeModal,
    openPracticeDetails,
    openGameAttendance,
    openPracticeAttendance,
    setOpenGameModal,
    setOpenGameDetails,
    setOpenPracticeModal,
    setOpenPracticeDetails,
  } = useStore();

  const [filter, setFilter] = useState<"all" | "game" | "practice">("all");

  const role = member?.role === "COACH";

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
    <>
      <div className="animate-fade-in mt-3 flex flex-col rounded-xl border border-orange-200/30 p-4 shadow-sm duration-300 sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="flex items-center text-xl font-semibold text-white">
            <CalendarClock className="mr-2 h-5 text-sm text-gray-400" />
            Activities for {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          <ActivityFilter
            currentFilter={filter}
            onFilterChange={(newFilter) => setFilter(newFilter)}
          />
        </div>
        {filteredActivities.length > 0 ? (
          <div className="scrollbar-none max-h-[430px] overflow-y-auto pr-2 md:max-h-[120rem] md:min-h-96 xl:max-h-[150rem]">
            <div className="flex flex-col gap-1">
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  member={member}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="scrollbar-none mt-4 flex h-96 flex-col items-center justify-center gap-3 rounded-2xl bg-gray-800 p-6 pr-2 md:max-h-72 xl:max-h-96">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-gray-400 opacity-50" />
            <p className="text-gray-400">
              No activities scheduled for this day
            </p>
            {role && (
              <Button
                aria-label="Add Activity"
                variant="primary"
                size="sm"
                className="mt-4 bg-gray-950 hover:bg-orange-200/10"
                onClick={() => setOpenGameModal(true)}
              >
                <Plus className="mr-1 h-4 w-4" /> Add Activity
              </Button>
            )}
          </div>
        )}

        {role && (
          <div className="mt-auto flex w-full items-end justify-center gap-4 pt-4">
            <Button
              aria-label="Create Game"
              onClick={() => setOpenGameModal(true)}
              type="button"
              variant="light"
              className="w-1/2 py-5"
            >
              Create Game
            </Button>
            <Button
              aria-label="Create Practice"
              onClick={() => setOpenPracticeModal(true)}
              type="button"
              variant="outline"
              className="w-1/2 py-5"
            >
              Create Practice
            </Button>
          </div>
        )}
      </div>

      {openGameModal && selectedDate && (
        <GameForm
          team={team}
          mode="create"
          member={member}
          onClose={() => setOpenGameModal(false)}
        />
      )}
      {openPracticeModal && selectedDate && (
        <PracticeForm
          team={team}
          mode="create"
          member={member}
          onClose={() => setOpenPracticeModal(false)}
        />
      )}
      {openGameDetails && (
        <GameForm
          team={team}
          mode="view"
          member={member}
          onClose={() => setOpenGameDetails(false)}
        />
      )}
      {openPracticeDetails && (
        <PracticeForm
          team={team}
          mode="view"
          member={member}
          onClose={() => setOpenPracticeDetails(false)}
        />
      )}
      {openGameAttendance && <AttendanceModal member={member} mode="Game" />}
      {openPracticeAttendance && (
        <AttendanceModal member={member} mode="Practice" />
      )}
    </>
  );
}
