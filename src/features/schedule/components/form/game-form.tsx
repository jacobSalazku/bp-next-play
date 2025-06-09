"use client";

import { Button } from "@/components/foundation/button/button";
import { CategoryBadge } from "@/components/foundation/category-badge";
import { Input } from "@/components/foundation/input";
import { useTeam } from "@/context/team-context";
import { cn } from "@/lib/utils";
import useStore from "@/store/store";
import type { TeamInformation, UserTeamMember } from "@/types";
import { getTypeBgColor } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityType } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { useCreateGameActivity } from "../../hooks/use-create-game";
import { useEditGameActivity } from "../../hooks/use-edit-activity";
import { getButtonText } from "../../utils/button-text";
import { gameSchema, type GameData } from "../../zod";

export type Mode = "view" | "edit" | "create";

type GameFormProps = {
  mode: Mode;
  team: TeamInformation;
  onClose: () => void;
  member: UserTeamMember;
};

const GameForm: FC<GameFormProps> = ({ onClose, mode, member }) => {
  const { teamSlug } = useTeam();
  const [formState, setFormState] = useState<Mode>(mode);
  const createGame = useCreateGameActivity(teamSlug, onClose);
  const editGame = useEditGameActivity(teamSlug, onClose);
  const router = useRouter();
  const { selectedDate, selectedActivity } = useStore();

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GameData>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      date: formattedDate,
      duration: 2,
      time: "11:00",
    },
  });

  const isViewMode = formState === "view";
  const isEditMode = formState === "edit";
  const isCreateMode = formState === "create";
  const role = member?.role === "COACH";

  const buttonText = getButtonText(isSubmitting, formState, "Game");

  const onSubmit = async (data: GameData) => {
    const date = new Date(data.date);

    const gameData = {
      ...data,
      id: selectedActivity?.id ?? "",
      date: date.toISOString(),
      teamId: teamSlug,
      type: ActivityType.GAME,
    };

    if (formState === "edit") {
      await editGame.mutateAsync(gameData);
      router.push(`/${teamSlug}/schedule`);
      setFormState("view");
    } else {
      await createGame.mutateAsync(gameData);
      router.push(`/${teamSlug}/schedule`);
    }
  };

  if ((isViewMode || isEditMode) && !selectedActivity) return null;
  if (isCreateMode && !selectedDate) return null;

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

        {(isEditMode || isCreateMode) && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <Input
              id="title"
              aria-label="Input the name of the opponent team"
              className="border-gray-700"
              label="Opponent Name"
              labelColor="light"
              type="text"
              placeholder="E.g. Eagles FC"
              {...register("title")}
              error={errors.title}
              errorMessage={errors.title?.message}
            />
            <Input
              id="time"
              aria-label="Input the start time of the game"
              className="border-gray-700"
              label="Start Time"
              labelColor="light"
              type="time"
              {...register("time")}
              error={errors.time}
              errorMessage={errors.time?.message}
            />
            <Input
              id="duration"
              aria-label="Input the duration of the game in hours"
              className="border-gray-700"
              label="Duration"
              labelColor="light"
              type="number"
              step="0.5"
              min="0.5"
              placeholder="E.g. 2"
              {...register("duration", {
                required: "Duration is required",
                min: 0.5,
              })}
              error={errors.duration}
              errorMessage={errors.duration?.message}
            />
            <Input
              id="date"
              aria-label="Input the date of the game"
              className="border-gray-700"
              label="Date"
              labelColor="light"
              type="date"
              {...register("date")}
              error={errors.date}
              errorMessage={errors.date?.message}
            />
            <div className="flex justify-end border-t border-gray-800 pt-4">
              {role && (
                <Button type="submit" variant="outline">
                  {buttonText}
                </Button>
              )}
            </div>
          </form>
        )}

        {isViewMode && selectedActivity && (
          <>
            <div className="flex flex-col gap-2 space-y-2 p-4 text-sm sm:text-base">
              <div className="flex flex-col gap-2">
                <div className="text-xs text-gray-400 sm:text-sm">Type</div>
                <div className="inline-block rounded-full py-2 text-xs text-black">
                  <CategoryBadge
                    label={selectedActivity.type}
                    className={cn(getTypeBgColor(selectedActivity.type))}
                  />
                </div>
              </div>
              {selectedActivity.type == ActivityType.PRACTICE && (
                <div className="flex flex-col space-x-2">
                  <div className="text-xs text-gray-400 sm:text-sm">
                    Type of Practice
                  </div>
                  <div>{selectedActivity.practiceType}</div>
                </div>
              )}
              <div className="flex flex-col space-x-2">
                <div className="text-xs text-gray-400 sm:text-sm">Time</div>
                <div>{selectedActivity.time}</div>
              </div>
              {selectedActivity.duration && (
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
                  {format(
                    new Date(selectedActivity.date),
                    "EEEE, MMMM d, yyyy",
                  )}
                </div>
              </div>
            </div>
            {role && (
              <div className="flex justify-end space-x-2 border-t border-gray-800 p-4">
                <Button
                  onClick={() => {
                    setFormState("edit");
                    reset({
                      title: selectedActivity.title,
                      time: selectedActivity.time,
                      duration: selectedActivity.duration ?? 2,
                      date: format(
                        new Date(selectedActivity.date),
                        "yyyy-MM-dd",
                      ),
                    });
                  }}
                  variant="outline"
                >
                  Edit Game
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GameForm;
