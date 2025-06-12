"use client";

import { Button } from "@/components/foundation/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/foundation/card";
import { Input } from "@/components/foundation/input";
import { RadioGroup } from "@/components/foundation/radio/radio-group";
import { RadioGroupItem } from "@/components/foundation/radio/radio-group-item";
import { useTeam } from "@/context/team-context";
import { RichTextEditor } from "@/features/wysiwyg/text-editor";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCanvasCourtImage } from "../hooks/use-canvas-court-image";
import { useCanvasDraw } from "../hooks/use-canvas-draw";
import { useCreatePlay } from "../hooks/use-create-play";
import { useInteractionHandlers } from "../hooks/use-interaction-handlers";
import { useResponsiveCanvas } from "../hooks/use-responsive-canvas";
import { getEventPosition } from "../utils/canvas/get-event-position";
import { getPlayerAtPosition } from "../utils/canvas/get-player-position";
import {
  categories,
  colors,
  initialPlayerPosition,
  tools,
} from "../utils/constants";
import type { DrawingLine, Player } from "../utils/types";
import { playSchema, type Play } from "../zod";

export function PlayForm() {
  const { teamSlug } = useTeam();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState("move");
  const [currentColor, setCurrentColor] = useState("#f97316");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [drawingLines, setDrawingLines] = useState<DrawingLine[]>([]);
  const [players, setPlayers] = useState<Player[]>(initialPlayerPosition);

  const createPlay = useCreatePlay(teamSlug);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Play>({
    resolver: zodResolver(playSchema),
    defaultValues: {},
  });

  const descriptionContent = watch("description");

  const { courtImgRef, courtImgLoaded } = useCanvasCourtImage("/BG-court.png");
  const canvasSize = useResponsiveCanvas(
    canvasRef as RefObject<HTMLCanvasElement>,
  );

  const { drawCourt } = useCanvasDraw(
    canvasRef as RefObject<HTMLCanvasElement>,
    courtImgRef,
    canvasSize,
    players,
    drawingLines,
  );

  const { startInteraction, continueInteraction } = useInteractionHandlers({
    canvasRef: canvasRef as RefObject<HTMLCanvasElement>,
    currentTool,
    currentColor,
    players,
    setPlayers,
    setDrawingLines,
    setIsDrawing,
    setIsDragging,
    setDraggedPlayer,
    isDragging,
    isDrawing,
    draggedPlayer,
  });

  useEffect(() => {
    if (courtImgLoaded) drawCourt();
  }, [canvasSize, players, drawingLines, courtImgLoaded, drawCourt]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && currentTool === "move") {
      const { x, y } = getEventPosition(e, canvasRef.current);
      const player = getPlayerAtPosition(x, y, players);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = player ? "grab" : "default";
      }
    }
  };

  useEffect(() => {
    setValue("canvas", JSON.stringify({ players, lines: drawingLines }));
    register("description", { required: true });
  }, [players, drawingLines, setValue, register]);

  const endInteraction = () => {
    setIsDrawing(false);
    setIsDragging(false);
    setDraggedPlayer(null);
  };

  const resetPlayers = () => setPlayers(initialPlayerPosition);
  const clearDrawings = () => setDrawingLines([]);
  const undoLastLine = () => setDrawingLines((prev) => prev.slice(0, -1));

  const onSubmit = async (data: Play) => {
    if (!canvasRef.current) return;
    // Get the base64 data URL from the canvas
    const canvasDataUrl = canvasRef.current.toDataURL();

    const playData = {
      ...data,
      canvas: canvasDataUrl,
      teamId: teamSlug,
      category: data.category,
    };

    return createPlay.mutateAsync(playData);
  };

  return (
    <div className="mx-auto my-auto w-full max-w-7xl space-y-6 p-2 sm:p-4">
      <div className="flex items-center gap-4 pt-4 pl-4 md:pl-0">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Create New Play
          </h1>
          <p className="text-sm text-gray-400">Design and describe your play</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col-reverse gap-6"
      >
        <div className="flex w-full flex-1 flex-col gap-4">
          <Card className="border border-gray-800 bg-gray-950 px-0">
            <CardHeader>
              <CardTitle className="text-white">Draw Your Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tools.map(({ id, icon: Icon, label }) => (
                  <Button
                    aria-label="Select Tool"
                    key={id}
                    onClick={() => setCurrentTool(id)}
                    variant={currentTool === id ? "primary" : "outline"}
                    className="flex items-center justify-center"
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </Button>
                ))}
                <Button
                  aria-label="Undo Last Line"
                  variant="outline"
                  onClick={undoLastLine}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Undo Line
                </Button>
                <Button
                  aria-label="Clear Drawings"
                  variant="outline"
                  onClick={clearDrawings}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Lines
                </Button>
                <Button
                  aria-label="Reset Players"
                  variant="outline"
                  onClick={resetPlayers}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Players
                </Button>
              </div>
              <div>
                <h3 className="mb-2 text-sm text-gray-400">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <Button
                      key={color}
                      style={{ backgroundColor: color }}
                      className={cn(
                        "h-8 w-8 rounded-full border-2",
                        currentColor === color
                          ? "border-white"
                          : "border-gray-700",
                      )}
                      onClick={() => setCurrentColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <Controller
                name="canvas"
                control={control}
                rules={{ required: true }}
                defaultValue={JSON.stringify({ players, lines: drawingLines })}
                render={() => (
                  <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="w-full max-w-full rounded border border-gray-700 bg-gray-950"
                    onMouseDown={startInteraction}
                    onTouchStart={startInteraction}
                    onMouseMove={(e) => {
                      handleMouseMove(e);
                      if (isDrawing || isDragging) continueInteraction(e);
                    }}
                    onTouchMove={continueInteraction}
                    onMouseUp={endInteraction}
                    onTouchEnd={endInteraction}
                    onMouseLeave={endInteraction}
                    defaultValue={JSON.stringify({
                      players,
                      lines: drawingLines,
                    })}
                  />
                )}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex w-full max-w-full min-w-0 flex-col gap-4 lg:w-full">
          <Card className="border border-gray-800 bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Play Details</CardTitle>
              <CardDescription className="text-gray-400">
                Name and describe your play.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex w-full flex-col gap-4">
                <Input
                  id="name"
                  label="Name"
                  labelColor="light"
                  aria-label="Play name input"
                  {...register("name")}
                  error={errors.name}
                  errorMessage={errors.name?.message}
                />
                <div className="flex w-full flex-col gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-white">
                    Category
                  </span>
                  <div>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "Please select a category" }}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-4 sm:flex-nowrap sm:gap-6"
                        >
                          {categories.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-900 shadow-sm transition hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                            >
                              <RadioGroupItem
                                value={option.id}
                                id={`position-${option.id}`}
                                className="rounded-full border border-gray-500 bg-white ring-0 focus:ring-0 data-[state=checked]:bg-gray-900"
                              />
                              <label
                                htmlFor={`position-${option.id}`}
                                className="text-md cursor-pointer"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <RichTextEditor
                  label="Explain the Play"
                  className="max-h-96 w-full max-w-full"
                  content={descriptionContent ?? ""}
                  onChange={(content) =>
                    setValue("description", content, { shouldValidate: true })
                  }
                />
                {errors.description && <p>{errors.description.message}</p>}
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full bg-white text-gray-900 hover:bg-orange-400 hover:text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Play"}
              </Button>
              {/* <Button
                onClick={savePlay}
                disabled={!playData.name || !playData.category}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Play
              </Button> */}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
