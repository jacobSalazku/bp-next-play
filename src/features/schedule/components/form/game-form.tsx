"use client";

import { Button } from "@/components/button/button";
import { Input } from "@/components/ui/input";
import { useIsCoach } from "@/hooks/use-is-coach";
import { cn } from "@/lib/utils";
import useStore from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { createGameActivity } from "../../lib/create-game";
import { editGameActivity } from "../../lib/edit-activity";
import { getTypeBgColor } from "../../utils/utils";
import { gameSchema, type GameData } from "../../zod";

export type Mode = "view" | "edit" | "create";

type GameFormProps = {
  mode: Mode;
  team: string;
  onClose: () => void;
};

const GameForm: FC<GameFormProps> = ({ onClose, team, mode }) => {
  const [formState, setFormState] = useState<Mode>(mode);
  const createGame = createGameActivity(team, onClose);
  const editGame = editGameActivity(team, onClose);
  const router = useRouter();
  const isCoach = useIsCoach();

  const { selectedDate, selectedActivity, setOpenGameModal, openGameModal } =
    useStore();

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const { register, handleSubmit, reset } = useForm<GameData>({
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

  const buttonText = () => {
    if (createGame.status === "pending") {
      return isEditMode ? "Editing..." : "Creating...";
    }
    return isCreateMode ? "Create Game" : "Edit Game";
  };

  const onSubmit = async (data: GameData) => {
    const date = new Date(data.date);

    const gameData = {
      ...data,
      id: selectedActivity?.id ?? "",
      date: date.toISOString(),
      teamId: team,
      type: "Game" as const,
    };

    if (formState === "edit") {
      await editGame.mutateAsync(gameData);
      router.push(`/${team}/schedule`);
      setFormState("view");
    } else {
      await createGame.mutateAsync(gameData);
      router.push(`/${team}/schedule`);
    }
  };
  useEffect(() => {
    console.log("Modal state changed:", openGameModal);
  }, [openGameModal]);

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
              label="Opponent Name"
              aria-label="Input the name of the opponent team"
              id="title"
              type="text"
              placeholder="E.g. Eagles FC"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              {...register("title")}
            />
            <Input
              label="Start Time"
              aria-label="Input the start time of the game"
              id="time"
              type="time"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              {...register("time")}
            />
            <Input
              label="Duration"
              aria-label="Input the duration of the game in hours"
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
              aria-label="Input the date of the game"
              id="date"
              type="date"
              className=""
              {...register("date")}
            />
            <div className="flex justify-end border-t border-gray-800 pt-4">
              {isCoach && <Button variant="outline">{buttonText()}</Button>}
            </div>
          </form>
        )}

        {isViewMode && selectedActivity && (
          <>
            <div className="flex flex-col gap-2 space-y-2 p-4 text-sm sm:text-base">
              <div className="flex flex-col gap-2">
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
              {selectedActivity.type == "Practice" && (
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
            <div className="flex justify-end space-x-2 border-t border-gray-800 p-4">
              <Button
                onClick={() => {
                  setFormState("edit");
                  reset({
                    title: selectedActivity.title,
                    time: selectedActivity.time,
                    duration: selectedActivity.duration ?? 2,
                    date: format(new Date(selectedActivity.date), "yyyy-MM-dd"),
                  });
                }}
                variant="outline"
              >
                Edit Game
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameForm;
