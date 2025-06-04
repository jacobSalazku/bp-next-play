import { Button } from "@/components/foundation/button/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/foundation/card";
import type { Play } from "@/types";
import { Eye } from "lucide-react";
import Image from "next/image";

type PlayCardProps = {
  play: Play[number];
  //   onView?: (play: Play) => void;
  //   onEdit?: (play: Play) => void;
};

export const PlayCard = ({ play }: PlayCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "offense":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "defense":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };
  return (
    <Card className="group cursor-pointer border border-gray-800 bg-gray-900 text-xs transition-all duration-200 hover:border-orange-300/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base text-white transition-colors group-hover:text-orange-400">
              {play.name}
            </CardTitle>
            <div className="mt-2 flex gap-2">
              {/* <Badge className={getCategoryColor(play.category)}>
                {play.category}
              </Badge>
              <Badge className={getDifficultyColor(play.difficulty)}>
                {play.difficulty}
              </Badge> */}
            </div>
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-gray-700 bg-gray-800">
              <DropdownMenuItem
                className="text-gray-300 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(play);
                }}
              >
                <Edit className="mr-2 h-3 w-3" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-gray-300 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate?.(play);
                }}
              >
                <Copy className="mr-2 h-3 w-3" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                className="text-red-400 hover:text-red-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(play.id);
                }}
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative mb-4 hidden aspect-video overflow-hidden rounded-lg border border-gray-800 bg-gray-950 md:block">
          {play.canvas ? (
            <Image
              src={play.canvas}
              alt={`Diagram for ${play.name}`}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No diagram available</p>
            </div>
          )}
        </div>
        <p className="line-clamp-2 border-t border-gray-700 pt-3">
          {play.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="primary"
          size="sm"

          // onClick={(e) => {
          //   e.stopPropagation();
          //   onView?.(play);
          // }}
        >
          <Eye className="mr-1 h-3 w-3" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
