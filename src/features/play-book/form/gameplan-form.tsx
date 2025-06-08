"use client";

import { Checkbox } from "@/components/card/checkbox";
import { Button } from "@/components/foundation/button/button";
import { CategoryBadge } from "@/components/foundation/category-badge";
import { Input } from "@/components/foundation/input";
import { useTeam } from "@/context/team-context";
import { getButtonText } from "@/features/schedule/utils/button-text";
import { RichTextEditor } from "@/features/wysiwyg/text-editor";
import { cn } from "@/lib/utils";
import { useCoachDashboardStore } from "@/store/use-coach-dashboard-store";
import type { Game } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Play } from "@prisma/client";
import { format } from "date-fns";
import { Clock, X } from "lucide-react";
import { useEffect, useRef, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { useCreateGameplan } from "../hooks/use-create-gameplan";
import { getCategoryColor } from "../utils/play-catergory-color";
import { gamePlanSchema, type GamePlanData } from "../zod";

export type Mode = "view" | "create";

type GamePlanFormProps = {
  games: Game[];
  mode: Mode;
  role: string;
  playbook?: Play[];
};

const GamePlanForm: FC<GamePlanFormProps> = ({
  games,
  mode,
  role,
  playbook,
}) => {
  const { teamSlug } = useTeam();
  const {
    openGamePlan,
    selectedGameplan,
    setOpenGamePlan,
    setGamePlanMode,
    setSelectedGameplan,
  } = useCoachDashboardStore();

  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedPlay, setSelectedPlay] = useState<string[] | null>([]);
  const [formState] = useState<Mode>(mode);
  const createGameplan = useCreateGameplan(teamSlug, () =>
    setOpenGamePlan(false),
  );
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setOpenGamePlan(false);
        setGamePlanMode("view");
        setSelectedGameplan(null);
      }
    };

    if (openGamePlan) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openGamePlan, setGamePlanMode, setOpenGamePlan, setSelectedGameplan]);

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
    register("activityId", { required: true });
  }, [register]);

  const notesContent = watch("notes");
  const isViewMode = formState === "view";
  const isCreateMode = formState === "create";
  const isCoach = role === "COACH";

  const buttonText = getButtonText(isSubmitting, formState, "GamePlan");

  const handleGameSelection = (game: Game) => {
    setSelectedGame(!selectedGame ? game.id : null);
    setValue("opponent", game.title, { shouldValidate: true });
    setValue("activityId", game.id, { shouldValidate: true });
  };

  const handlePlaySelection = (play: Play) => {
    setSelectedPlay((prev) => {
      const updated = prev?.includes(play.id)
        ? prev.filter((id) => id !== play.id)
        : [...(prev ?? []), play.id];

      setValue("playsId", updated, { shouldValidate: true });

      return updated;
    });
  };

  const onSubmit = async (data: GamePlanData) => {
    const gamePlan = {
      id: "",
      name: data.name,
      notes: data.notes,
      teamId: teamSlug,
      activityId: data.activityId,
      opponent: data.opponent,
      playsId: data.playsId,
    };

    await createGameplan.mutateAsync(gamePlan);
  };

  return (
    <>
      {openGamePlan && isViewMode && (
        <div
          ref={formRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-xs"
        >
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg rounded-b-lg border border-gray-800 bg-gray-950 text-white">
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
        <div
          ref={formRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/10 p-3 backdrop-blur-xs"
        >
          <div className="flex w-full max-w-4xl items-center justify-between rounded-t-lg border border-b border-gray-800 bg-white p-2">
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
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-b-lg border border-gray-800 bg-gray-950 text-white">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col space-y-4 px-2 py-4 lg:px-6"
            >
              <div className="sr-only">
                <Input
                  id="teamId"
                  label="Team ID"
                  {...register("teamId")}
                  placeholder="Enter team ID"
                  defaultValue={teamSlug}
                />
              </div>
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
              <div className="flex w-full flex-row gap-4 pt-2 text-sm">
                <div className="flex w-full flex-col gap-2">
                  <label>Connect to Game</label>
                  <div className="scrollbar-none flex h-48 max-h-48 w-full flex-col gap-2 overflow-y-auto rounded-lg border border-gray-700 p-3">
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
                                  selectedGame === game.id
                                    ? "text-gray-900"
                                    : "",
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
                </div>
                <div className="hidden w-full flex-col gap-2 md:flex">
                  <label>Select play</label>
                  <div className="scrollbar-none flex h-48 max-h-48 w-full flex-col gap-2 overflow-y-auto rounded-lg border border-gray-700 p-3">
                    {playbook && playbook.length > 0 && (
                      <>
                        {playbook.map((play) => (
                          <div
                            key={play.id}
                            className={cn(
                              selectedPlay?.includes(play.id)
                                ? "bg-gray-800"
                                : "",
                              "flex w-full cursor-pointer flex-row items-center justify-between rounded-lg px-3 py-1.5 text-white transition-colors hover:bg-gray-700",
                            )}
                            onClick={() => handlePlaySelection(play)}
                          >
                            <Checkbox
                              label={play.name}
                              onCheckedChange={() => handlePlaySelection(play)}
                              checked={selectedPlay?.includes(play.id)}
                              tabIndex={-1}
                              aria-label={`Select play ${play.name}`}
                              className="mr-2"
                            >
                              <CategoryBadge
                                label={play.category}
                                className={cn(getCategoryColor(play.category))}
                              />
                            </Checkbox>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 md:hidden">
                <label>Select play</label>
                <div className="scrollbar-none flex h-48 max-h-36 w-full flex-col gap-2 overflow-y-auto rounded-lg border border-gray-700 p-3">
                  {playbook && playbook.length > 0 && (
                    <>
                      {playbook.map((play) => (
                        <div
                          key={play.id}
                          className={cn(
                            selectedPlay?.includes(play.id)
                              ? "bg-gray-800"
                              : "",
                            "flex w-full cursor-pointer flex-row items-center justify-between rounded-lg px-3 py-1.5 text-white transition-colors hover:bg-gray-700",
                          )}
                          onClick={() => handlePlaySelection(play)}
                        >
                          <Checkbox
                            label={play.name}
                            onCheckedChange={() => handlePlaySelection(play)}
                            checked={selectedPlay?.includes(play.id)}
                            tabIndex={-1}
                            aria-label={`Select play ${play.name}`}
                            className="mr-2 border"
                          >
                            <CategoryBadge
                              label={play.category}
                              className={cn(getCategoryColor(play.category))}
                            />
                          </Checkbox>
                        </div>
                      ))}
                    </>
                  )}
                </div>
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
