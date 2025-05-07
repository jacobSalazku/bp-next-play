"use client";

import useStore from "@/store/store";
import type { Activity } from "@prisma/client";
import { format } from "date-fns";

export const ActivityDetails = ({ activity }: { activity: Activity }) => {
  const { setOpenGameDetails } = useStore();
  return (
    <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg border border-gray-800 bg-black">
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h2 className="text-lg font-normal sm:text-xl">{activity.title}</h2>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <div className="text-xs text-gray-400 sm:text-sm">Date & Time</div>
            <div className="mt-1 text-sm sm:text-base">
              {format(new Date(activity.date), "EEEE, MMMM d, yyyy")}
            </div>
            <div className="mt-1 text-sm sm:text-base">
              {format(new Date(activity.date), "h:mm a")}
            </div>
          </div>
          {activity.duration && (
            <div>
              <div className="text-xs text-gray-400 sm:text-sm">Duration</div>
              <div className="mt-1 text-sm sm:text-base">
                {activity.duration}
              </div>
            </div>
          )}
          <div>
            <div className="text-xs text-gray-400 sm:text-sm">Type</div>
            <div className="mt-1 inline-block rounded-full px-3 py-1 text-xs text-black">
              {activity.type}
            </div>
          </div>
          é
        </div>
        <div className="flex justify-end border-t border-gray-800 p-4">
          <button
            onClick={() => setOpenGameDetails(false)}
            className="cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
