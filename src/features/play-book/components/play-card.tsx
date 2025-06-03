import { Button } from "@/components/foundation/button/button";
import { CardContent } from "@/components/foundation/card";
import type { Play } from "@/types";
import { cn } from "@/utils/tw-merge";
import { Edit, Eye } from "lucide-react";
import Image from "next/image";

type PlayCardProps = {
  play: Play[number];
  //   onView?: (play: Play) => void;
  //   onEdit?: (play: Play) => void;
};

export const PlayCard = ({ play }: PlayCardProps) => {
  return (
    <CardContent className="group relative cursor-pointer rounded-2xl border border-orange-300/30 bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 shadow-md transition duration-300 hover:border-orange-400/40 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate text-xl font-semibold text-white transition-colors">
            {play.name}
          </h3>
          {play.category && (
            <span
              className={cn(
                "inline-block rounded-full px-3 py-0.5 text-xs font-medium",
                play.category === "offense" &&
                  "bg-orange-500/10 text-orange-400",
                play.category === "defense" && "bg-blue-500/10 text-blue-400",
                play.category === "SPECIAL" &&
                  "bg-purple-500/10 text-purple-400",
              )}
            >
              {play.category}
            </span>
          )}
        </div>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-xl border border-gray-800 bg-gray-950 transition-all duration-300">
        <Image
          src={play.canvas}
          alt={`Diagram for ${play.name}`}
          width={600}
          height={400}
          className="h-full w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-[1.015]"
        />
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          //   onClick={() => onView?.(play)}
          className="flex-1 border border-white/10 bg-white/10 text-white transition hover:bg-white/20 hover:text-orange-400"
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        <Button
          size="sm"
          //   onClick={() => onEdit?.(play)}
          className="flex-1 border border-white/10 bg-white/10 text-white transition hover:bg-white/20 hover:text-orange-400"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
    </CardContent>
  );
};
