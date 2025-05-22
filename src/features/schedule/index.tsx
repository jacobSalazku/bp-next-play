import { getUser } from "@/api/user";
import type { Activity, TeamInformation } from "@/types";
import { ActivityList } from "./components/activity/activity-list";
import { HorizontalCalender } from "./components/calender/horizontal-calander";

const ScheduleBlock = async ({
  activities,
  team,
}: {
  activities: Activity[];
  team: TeamInformation;
}) => {
  const { teamMember } = await getUser();

  if (!teamMember) return null;

  return (
    <div className="font-roboto flex w-full items-center justify-center p-4">
      <div className="h-full w-full max-w-7xl">
        <HorizontalCalender activities={activities} team={team} />
        <ActivityList activities={activities} team={team} member={teamMember} />
      </div>
    </div>
  );
};

export { ScheduleBlock };
