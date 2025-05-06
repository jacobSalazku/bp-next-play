"use client";

import { type Activity } from "@prisma/client";
import { redirect } from "next/navigation";
import { useState } from "react";
import { ActivityList } from "./components/activity/activity-list";
import { HorizontalCalender } from "./components/calender/horizontal-calander";

const ScheduleBlock = ({
  activities,
  team,
}: {
  activities: Activity[];
  team: string;
}) => {
  if (!team) {
    redirect("/create-team");
  }
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  if (!activities || activities.length === 0) {
  }

  return (
    <div className="bg-background flex w-full items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <HorizontalCalender
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          activities={activities}
        />
        <ActivityList
          selectedDate={selectedDate}
          className="bg-background mt-4 rounded-xl border p-4 shadow-sm"
          activities={activities}
          team={team}
        />
      </div>
    </div>
  );
};

export { ScheduleBlock };
