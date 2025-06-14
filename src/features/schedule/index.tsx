import { getUser } from "@/api/user";
import type { Activity, TeamInformation } from "@/types";
import { ActivityList } from "./components/activity/activity-list";
import { HorizontalCalender } from "./components/calender/horizontal-calender";

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
    <div className="font-roboto flex h-full w-full items-start justify-center overflow-y-auto bg-transparent px-2 py-3">
      <div className="h-full w-full">
        <HorizontalCalender activities={activities} team={team} />
        <ActivityList activities={activities} team={team} member={teamMember} />
      </div>
    </div>
  );
};

export { ScheduleBlock };
