import { Button } from "@/components/foundation/button/button";
import { Card, CardFooter, CardHeader } from "@/components/foundation/card";
import { CategoryBadge } from "@/components/foundation/category-badge";
import type { GamePlan } from "@/types";
import { Calendar, Eye, Play as PlayIcon, Trash2 } from "lucide-react";

interface GamePlanCardProps {
  item: GamePlan;
  onView?: (gameplan: GamePlan) => void;
  onDelete?: (gameplan: GamePlan) => void;
}

export const PreparationCard = ({
  item,
  onView,
  onDelete,
}: GamePlanCardProps) => {
  return (
    <Card className="flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-600 bg-gray-950 text-sm text-white shadow-lg">
      <CardHeader className="flex w-full items-start justify-between border-b border-gray-900 px-4 pt-4 pb-2">
        <h3 className="text-lg font-bold">{item.name}</h3>
        {item.activity ? (
          <span>{`vs ${item.activity.title}`}</span>
        ) : (
          <span className="text-gray-400">Link to activity</span>
        )}
      </CardHeader>
      <div className="w-full flex-1 items-start gap-3 px-4 py-2 text-sm text-gray-400">
        <div className="flex w-full flex-col items-start gap-2">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <h3 className="font-bold">
              {item.activity
                ? item.activity.date.toISOString().split("T")[0]
                : "No date set"}
            </h3>
          </span>
          <div className="flex items-center gap-2">
            <PlayIcon className="h-4 w-4" />
            <span>{item.plays.length} plays selected</span>
          </div>
          <div className="mt-2 w-full rounded-lg bg-gray-700 p-3">
            {item.plays ? (
              item.plays
                .slice(0, 3)
                .map((play, idx) => (
                  <CategoryBadge
                    key={play.id ?? idx}
                    label={play.name}
                    className="border border-gray-700 bg-gray-900 p-1 text-xs text-white"
                  />
                ))
            ) : (
              <span className="text-gray-400">No plays selected</span>
            )}
          </div>
        </div>
      </div>
      <CardFooter className="flex w-full justify-between border-t border-gray-700 px-4 py-2">
        <Button variant="light" size="sm" onClick={() => onView?.(item)}>
          <Eye className="mr-1 h-3 w-3" />
          View Details
        </Button>
        <Button
          variant="danger"
          aria-label="Delete Game Plan"
          size="sm"
          onClick={() => onDelete?.(item)}
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
