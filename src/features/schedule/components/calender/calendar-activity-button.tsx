import { cn } from "@/lib/utils";
import type { Activity } from "@/types";
import { getTypeBgColor } from "@/utils/";
import type { MouseEvent } from "react";

type ActivityType = "Game" | "Practice" | "Multiple";

type ActivityButtonProps = {
  activity: Activity;
  onClick: (e: MouseEvent<HTMLButtonElement>, activity: Activity) => void;
};

export function CalendarActivityButton({
  activity,
  onClick,
}: ActivityButtonProps) {
  return (
    <button
      type="button"
      key={`${activity.id}-${activity.title}`}
      onClick={(e) => onClick(e, activity)}
      className={cn(
        getTypeBgColor(activity.type as ActivityType),
        "mb-1 inline-flex w-full cursor-pointer items-center justify-between truncate rounded px-1 py-1 text-xs font-medium hover:opacity-90 lg:h-full lg:max-h-8",
      )}
    >
      {" "}
      <div className="truncate">{activity.title}</div>{" "}
      <div className="text-xs opacity-90">{activity.time}</div>{" "}
    </button>
  );
}
