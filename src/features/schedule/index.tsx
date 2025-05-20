import { getRole } from "@/api/role";
import { getUser } from "@/api/user";
import type { Activity, TeamInformation } from "@/types";
import type { TeamMemberRole } from "@/types/enum";
import { ActivityList } from "./components/activity/activity-list";
import { HorizontalCalender } from "./components/calender/horizontal-calander";

const ScheduleBlock = async ({
  activities,
  team,
}: {
  activities: Activity[];
  team: TeamInformation;
}) => {
  const role = (await getRole()) as TeamMemberRole;
  const { teamMember } = await getUser();

  return (
    <div className="font-roboto flex w-full items-center justify-center p-4">
      <div className="h-full w-full max-w-7xl">
        <HorizontalCalender activities={activities} team={team} />
        <ActivityList
          role={role}
          activities={activities}
          team={team}
          member={teamMember}
        />
      </div>
    </div>
  );
};

export { ScheduleBlock };
