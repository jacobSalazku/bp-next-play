"use client";

import { cn } from "@/lib/utils";
import useStore from "@/store/store";
import { format } from "date-fns";
import { getTypeBgColor } from "../../utils/utils";

export const ActivityDetails = () => {
  const {
    openGameDetails,
    openPracticeDetails,
    setOpenGameDetails,
    setOpenPracticeDetails,
    selectedActivity,
  } = useStore();

  const isModalOpen = openGameDetails || openPracticeDetails;

  if (!selectedActivity || !isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg border border-gray-800 bg-black">
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h2 className="text-lg font-normal sm:text-xl">
            {selectedActivity.title}
          </h2>
        </div>
        <div className="p-4 text-sm sm:text-base">
          <div>
            <div className="text-xs text-gray-400 sm:text-sm">Date</div>
            <div>
              {format(new Date(selectedActivity.date), "EEEE, MMMM d, yyyy")}
            </div>
            <div className="text-xs text-gray-400 sm:text-sm"> Time</div>
            <div>{selectedActivity.time}</div>
          </div>
          {selectedActivity.duration && (
            <>
              <div className="text-xs text-gray-400 sm:text-sm">Duration</div>
              <div>{selectedActivity.duration}</div>
            </>
          )}
          <div>
            <div className="text-xs text-gray-400 sm:text-sm">Type</div>
            <div className="inline-block rounded-full py-2 text-xs text-black">
              <span
                className={cn(
                  getTypeBgColor(selectedActivity.type),
                  "rounded-xl p-2",
                )}
              >
                {selectedActivity.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-gray-800 p-4">
          <button
            onClick={() => {
              setOpenGameDetails(false);
              setOpenPracticeDetails(false);
            }}
            className="cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
