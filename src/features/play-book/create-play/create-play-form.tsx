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
import { Textarea } from "@/components/foundation/textarea";
import { cn } from "@/lib/utils";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useCanvasCourtImage } from "../hooks/use-canvas-court-image";
import { useCanvasDraw } from "../hooks/use-canvas-draw";
import { useInteractionHandlers } from "../hooks/use-interaction-handlers";
import { useResponsiveCanvas } from "../hooks/use-responsive-canvas";
import { getEventPosition } from "../utils/canvas/get-event-position";
import { getPlayerAtPosition } from "../utils/canvas/get-player-position";
import { colors, initialPlayerPosition, tools } from "../utils/constants";
import type { DrawingLine, Player } from "../utils/types";

type PlayCreatorProps = {
  onBack: () => void;
};

export function CreatePlay({ onBack }: PlayCreatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState("move");
  const [currentColor, setCurrentColor] = useState("#f97316");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [drawingLines, setDrawingLines] = useState<DrawingLine[]>([]);
  const [players, setPlayers] = useState<Player[]>(initialPlayerPosition);
  const [playData, setPlayData] = useState({
    name: "",
    category: "",
    description: "",
    notes: "",
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

  const endInteraction = () => {
    setIsDrawing(false);
    setIsDragging(false);
    setDraggedPlayer(null);
  };

  const resetPlayers = () => setPlayers(initialPlayerPosition);
  const clearDrawings = () => setDrawingLines([]);
  const undoLastLine = () => setDrawingLines((prev) => prev.slice(0, -1));

  const savePlay = () => {
    if (!playData.name || !playData.category) {
      alert("Please enter a name and category.");
      return;
    }

    const canvas = canvasRef.current;
    const canvasData = canvas?.toDataURL();

    const newPlay = {
      id: Date.now().toString(),
      name: playData.name,
      category: playData.category,
      description: playData.description,
      notes: playData.notes,
      canvas: canvasData,
      players,
      drawings: drawingLines,
      createdAt: new Date().toISOString(),
    };

    console.log("Saved play:", newPlay);
    onBack(); // or show a success modal
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

      <div className="flex flex-col flex-col-reverse gap-6 xl:flex-row">
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
                    className="min-w-[7rem] justify-start"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  id="playName"
                  label="Play Name"
                  labelColor="light"
                  value={playData.name}
                  onChange={(e) =>
                    setPlayData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <Input
                  id="category"
                  label="Category"
                  labelColor="light"
                  placeholder="e.g. Zone Offense"
                  value={playData.category}
                  onChange={(e) =>
                    setPlayData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white">Short description</label>
                <Textarea
                  id="description"
                  placeholder="Short description..."
                  className="bg-gray-800"
                  value={playData.description}
                  onChange={(e) =>
                    setPlayData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                onClick={savePlay}
                disabled={!playData.name || !playData.category}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Play
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
