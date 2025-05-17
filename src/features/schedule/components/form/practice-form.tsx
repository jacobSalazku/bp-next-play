"use client";

import { Button } from "@/components/button/button";
import { Input } from "@/components/ui/input";
import { useIsCoach } from "@/hooks/use-is-coach";

import { useTeam } from "@/context/use-team";
import useStore from "@/store/store";
import type { TeamInformation } from "@/types";
import { getTypeBgColor } from "@/utils";
import { cn } from "@/utils/tw-merge";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import type { Mode } from "fs";
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { useCreatePracticeActivity } from "../../hooks/use-create-practice";
import { useEditPracticeActivity } from "../../hooks/use-edit-activity";
import { practiceSchema, PracticeType, type PracticeData } from "../../zod";

type PracticeProps = {
  mode: Mode;
  team: TeamInformation;
  onClose: () => void;
};

const PracticeForm: FC<PracticeProps> = ({ mode, onClose }) => {
  const { teamSlug } = useTeam();
  const [formState, setFormState] = useState<Mode>(mode);
  const createPractice = useCreatePracticeActivity(teamSlug, onClose);
  const editPractice = useEditPracticeActivity(teamSlug, onClose);
  const router = useRouter();
  const isCoach = useIsCoach();

  const {
    selectedDate,
    openGameDetails,
    openPracticeDetails,
    selectedActivity,
  } = useStore();

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const { register, handleSubmit, reset } = useForm<PracticeData>({
    resolver: zodResolver(practiceSchema),
    defaultValues: {
      date: formattedDate,
      duration: 2,
      time: "18:00",
    },
  });

  const isViewMode = formState === "view";
  const isEditMode = formState === "edit";
  const isCreateMode = formState === "create";

  const onSubmit = async (data: PracticeData) => {
    const date = new Date(data.date);

    const practiceData = {
      ...data,
      id: selectedActivity?.id ?? "",
      date: date.toISOString(),
      teamId: teamSlug,
      type: "Practice" as const,
    };

    if (formState === "edit") {
      await editPractice.mutateAsync(practiceData);
      void router.push(`/${teamSlug}/schedule`);
      setFormState("view");
    } else {
      await createPractice.mutateAsync(practiceData);
      void router.push(`/${teamSlug}/schedule`);
    }
  };

  const shouldShowModal =
    formState === "create" ||
    (selectedActivity && (openGameDetails || openPracticeDetails));

  if (!shouldShowModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg border border-gray-800 bg-black">
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h2 className="text-lg font-normal sm:text-xl">
            {isViewMode
              ? selectedActivity?.title
              : isEditMode
                ? (selectedActivity?.title ?? "Edit Game")
                : "Create Game"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-400 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {isViewMode && selectedActivity && (
          <>
            <div className="flex flex-col gap-2 space-y-2 p-4 text-sm sm:text-base">
              <div className="flex flex-col gap-2">
                <div className="text-xs text-gray-400 sm:text-sm">Type</div>
                <div className="inline-block rounded-full py-2 text-xs text-black">
                  <span
                    className={cn(
                      selectedActivity
                        ? getTypeBgColor(selectedActivity.type)
                        : "",
                      "rounded-xl p-2",
                    )}
                  >
                    {selectedActivity?.type}
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-x-2">
                <div className="text-xs text-gray-400 sm:text-sm"> Time</div>
                <div>{selectedActivity?.practiceType}</div>
              </div>
              <div className="flex flex-col space-x-2">
                <div className="text-xs text-gray-400 sm:text-sm"> Time</div>
                <div>{selectedActivity?.time}</div>
              </div>
              {selectedActivity?.duration && (
                <div className="flex flex-col space-x-2">
                  <div className="text-xs text-gray-400 sm:text-sm">
                    Duration
                  </div>
                  <div>{selectedActivity.duration}</div>
                </div>
              )}
              <div className="flex flex-col space-x-2">
                <div className="text-xs text-gray-400 sm:text-sm">Date</div>
                <div>
                  {selectedActivity &&
                    format(
                      new Date(selectedActivity.date),
                      "EEEE, MMMM d, yyyy",
                    )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 border-t border-gray-800 p-4">
              <Button
                onClick={() => {
                  setFormState("edit");
                  reset({
                    title: selectedActivity.title,
                    date: format(new Date(selectedActivity.date), "yyyy-MM-dd"),
                    time: selectedActivity.time,
                    duration: selectedActivity.duration ?? undefined,
                    practiceType:
                      (selectedActivity.practiceType as PracticeType) ??
                      undefined,
                  });
                }}
                variant="outline"
              >
                Edit practice
              </Button>
            </div>
          </>
        )}

        {(isEditMode || isCreateMode) && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <Input
              label="Title"
              aria-label="Practice title input"
              id="title"
              type="text"
              placeholder="voorbereiding wedstrijd"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              {...register("title")}
            />
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-100">
                Practice Type
              </label>
              <div className="flex flex-col gap-3">
                {Object.values(PracticeType).map((practice) => (
                  <label key={practice} className="flex items-center space-x-3">
                    <input
                      aria-label={`Practice type radio input${practice}`}
                      type="radio"
                      value={practice}
                      {...register("practiceType", {
                        required: "Please select a practice type",
                      })}
                      className="form-radio text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-300">{practice}</span>
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Start Time"
              aria-label="Practice start time input"
              id="time"
              type="time"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              {...register("time")}
            />
            <Input
              label="Duration"
              aria-label="Practice duration input"
              id="duration"
              type="number"
              step="0.5"
              min="0.5"
              placeholder="E.g. 2"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              {...register("duration", {
                required: "Duration is required",
                min: 0.5,
              })}
            />
            <Input
              label="Date"
              aria-label="Practice date input"
              id="date"
              type="date"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              {...register("date")}
            />
            <div className="flex justify-end gap-3 pt-4">
              {isCoach && isEditMode && (
                <Button type="submit" variant="outline">
                  Edit Practice
                </Button>
              )}
              {isCoach && isCreateMode && (
                <Button type="submit" variant="outline">
                  Create Practice
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PracticeForm;
