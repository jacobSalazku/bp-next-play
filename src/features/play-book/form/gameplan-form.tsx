"use client";

import { Button } from "@/components/foundation/button/button";
import { Input } from "@/components/foundation/input";
import { useTeam } from "@/context/team-context";
import { getButtonText } from "@/features/schedule/utils/button-text";
import { RichTextEditor } from "@/features/wysiwyg/text-editor";
import { cn } from "@/lib/utils";
import { useCoachDashboardStore } from "@/store/use-coach-dashboard-store";
import type { Game } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Clock, X } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { useCreateGameplan } from "../hooks/use-create-gameplan";
import { gamePlanSchema, type GamePlanData } from "../zod";

export type Mode = "view" | "create";

type GamePlanFormProps = {
  games: Game[];
  mode: Mode;
  role: string;
};

const GamePlanForm: FC<GamePlanFormProps> = ({ games, mode, role }) => {
  const { teamSlug } = useTeam();
  const {
    openGamePlan,
    selectedGameplan,
    setOpenGamePlan,
    setGamePlanMode,
    setSelectedGameplan,
  } = useCoachDashboardStore();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [formState] = useState<Mode>(mode);
  const createGameplan = useCreateGameplan(teamSlug, () =>
    setOpenGamePlan(false),
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GamePlanData>({
    resolver: zodResolver(gamePlanSchema),
    defaultValues: {
      notes: "",
    },
  });

  useEffect(() => {
    register("notes", { required: true });
    register("opponent", { required: true });
  }, [register]);

  const notesContent = watch("notes");
  const isViewMode = formState === "view";
  const isCreateMode = formState === "create";
  const isCoach = role === "COACH";

  const buttonText = getButtonText(isSubmitting, formState, "GamePlan");

  const handleGameSelection = (game: Game) => {
    setSelectedGame(!selectedGame ? game.id : null);
    setValue("opponent", game.title, { shouldValidate: true });
  };

  const onSubmit = async (data: GamePlanData) => {
    const gamePlan = {
      id: "",
      name: data.name,
      notes: data.notes,
      teamId: teamSlug,
      activityId: data.activityId,
      opponent: data.opponent,
    };
    console.log("GamePlanData", data);

    await createGameplan.mutateAsync(gamePlan);
  };

  return (
    <>
      {openGamePlan && isViewMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg border border-gray-800 bg-gray-950 text-white">
            <div className="flex items-center justify-between border-b border-gray-800 bg-white p-4">
              <h2 className="font-righteous text-lg font-normal text-gray-900 sm:text-xl">
                {isViewMode ? "View GamePlan" : "Create GamePlan"}
              </h2>
              <button
                className="text-xl font-bold text-gray-400 hover:text-white"
                aria-label="Close"
                onClick={() => {
                  setOpenGamePlan(false);
                  setGamePlanMode("view");
                  setSelectedGameplan(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-2 space-y-2 p-4 text-sm sm:text-base">
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-gray-400 sm:text-sm">Name</div>
                  <div>{selectedGameplan?.name}</div>
                </div>
                <div className="flex flex-col space-x-2">
                  <div className="text-xs text-gray-400 sm:text-sm">
                    Opponent
                  </div>
                  <div>{selectedGameplan?.opponent}</div>
                </div>
                <div className="flex flex-col space-x-2">
                  <div className="text-xs text-gray-400 sm:text-sm">Notes</div>
                  <div>{selectedGameplan?.notes}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {openGamePlan && isCreateMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg border border-gray-800 bg-gray-950 text-white">
            <div className="flex items-center justify-between border-b border-gray-800 bg-white p-4">
              <h2 className="font-righteous text-lg font-normal text-gray-950 sm:text-xl">
                Create Gameplan
              </h2>
              <button
                className="rounded p-1 text-xl font-bold text-gray-950"
                aria-label="Close"
                onClick={() => {
                  setOpenGamePlan(false);
                  setGamePlanMode("view");
                  setSelectedGameplan(null);
                }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit, (data) => {
                console.error("Form submission error:", data);
              })}
              className="flex w-full flex-col space-y-4 px-6 py-4"
            >
              <Input
                id="name"
                aria-label="Input the name of the opponent team"
                className="border-gray-700"
                label="Gameplan Name"
                labelColor="light"
                type="text"
                placeholder="E.g. Eagles FC"
                {...register("name")}
                error={errors.name}
                errorMessage={errors.name?.message}
              />

              <div className="mb-2 w-full text-sm">
                Connect to Activity (Optional)
              </div>
              <div className="scrollbar-none flex max-h-60 flex-col gap-2 overflow-y-auto rounded-lg border border-gray-700 p-3">
                {games && games.length > 0 && (
                  <>
                    {games.map((game) => (
                      <div
                        key={game.id}
                        className={`cursor-pointer rounded-lg border border-gray-700 p-3 text-white transition-colors ${
                          selectedGame === game.id
                            ? "border-gray-950 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleGameSelection(game)}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              selectedGame === game.id ? "text-gray-900" : "",
                            )}
                          >
                            vs {game.title}
                          </span>
                          <span
                            className={cn(
                              selectedGame === game.id
                                ? "text-gray-900"
                                : "text-gray-400",
                              "text-xs",
                            )}
                          >
                            {format(new Date(game.date), "MMMM d, yyyy")}
                          </span>
                        </div>
                        <div
                          className={cn(
                            selectedGame === game.id
                              ? "text-gray-900"
                              : "text-gray-400",
                          )}
                        >
                          <Clock className="mr-1 inline h-4 w-4" />
                          {game.time}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div>
                <RichTextEditor
                  label="Explain Game Plan"
                  className="max-h-96 w-full max-w-full"
                  content={notesContent ?? ""}
                  onChange={(content) =>
                    setValue("notes", content, { shouldValidate: true })
                  }
                />
              </div>
              <div className="bg-g flex justify-end border-t border-gray-800 pt-4">
                {isCoach && (
                  <Button type="submit" variant="outline">
                    {buttonText}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GamePlanForm;
