import type { TeamInformation } from "@/types";
import { type Activity } from "@prisma/client";
import { ActivityList } from "./components/activity/activity-list";
import { HorizontalCalender } from "./components/calender/horizontal-calander";

const ScheduleBlock = ({
  activities,
  team,
}: {
  activities: Activity[];
  team: TeamInformation;
}) => {
  return (
    <div className="font-roboto flex w-full items-center justify-center p-4">
      <div className="h-full w-full max-w-7xl">
        <HorizontalCalender activities={activities} team={team} />
        <ActivityList activities={activities} team={team} />
      </div>
    </div>
  );
};

export { ScheduleBlock };
