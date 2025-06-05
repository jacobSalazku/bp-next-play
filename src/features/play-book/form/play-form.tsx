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
import { Textarea } from "@/components/foundation/textarea";
import { useTeam } from "@/context/team-context";
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
    formState: { errors, isSubmitting },
  } = useForm<Play>({
    resolver: zodResolver(playSchema),
    defaultValues: {},
  });

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
  }, [players, drawingLines, setValue]);

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
    };

    return createPlay.mutateAsync(playData);
  };

  return (
    <div className="w-full space-y-6 p-2 sm:p-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Create New Play
          </h1>
          <p className="text-sm text-gray-400">Design and describe your play</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log("Validation errors:", errors);
        })}
        className="flex flex-col-reverse gap-6 xl:flex-row"
      >
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <Card className="border border-gray-800 bg-gray-950">
            <CardHeader>
              <CardTitle className="text-white">Draw Your Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tools.map(({ id, icon: Icon, label }) => (
                  <Button
                    key={id}
                    onClick={() => setCurrentTool(id)}
                    variant={currentTool === id ? "secondary" : "outline"}
                    className="flex items-center justify-center"
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </Button>
                ))}
                <Button variant="outline" onClick={undoLastLine}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Undo Line
                </Button>
                <Button variant="outline" onClick={clearDrawings}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Lines
                </Button>
                <Button variant="outline" onClick={resetPlayers}>
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
        <div className="flex w-full max-w-full min-w-0 flex-col gap-4 lg:w-full xl:w-2/5">
          <Card className="border border-gray-800 bg-gray-900">
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
                    <RadioGroup className="justify flex flex-row items-center gap-12">
                      {categories.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-2 rounded-lg bg-orange-400/50 px-4 py-2"
                        >
                          <RadioGroupItem
                            {...register("category")}
                            value={option.id}
                            className="rounded-full border border-gray-500 bg-white ring-0 focus:ring-0 data-[state=checked]:bg-gray-900"
                            id={`position-${option.id}`}
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
                    {errors.category && <p>{errors.category.message}</p>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white">Short description</label>
                <Textarea
                  id="description"
                  placeholder="Short description..."
                  className="bg-gray-800"
                  {...register("description")}
                  rows={6}
                  cols={50}
                />
                {errors.category && <p>{errors.category.message}</p>}
              </div>
              <Button type="submit" variant="secondary" className="w-full">
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
