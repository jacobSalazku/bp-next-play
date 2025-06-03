"use client";

import { Button } from "@/components/foundation/button/button";
import { CardContent } from "@/components/foundation/card";
import type { Play } from "@/types";
import { cn } from "@/utils/tw-merge";
import { Edit, Eye, Plus } from "lucide-react";
import Image from "next/image";
import { type FC, useState } from "react";
import { PlayCategoryFilter } from "./play-category-filter";

type PlayCategory = "offense" | "defense" | "special";
type PageProps = {
  playbook?: Play;
};
const PlaybookLibraryPage: FC<PageProps> = ({ playbook }) => {
  const [activeCategory, setActiveCategory] = useState<PlayCategory>();

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Plays Library
          </h1>
          <p className="mt-1 text-sm text-gray-300 sm:text-base">
            Manage and organize your basketball plays
          </p>
        </div>
        <Button
          className="w-full bg-orange-500 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-950 sm:w-auto"
          aria-label="Create new play"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Play
        </Button>
      </div>
      <PlayCategoryFilter
        activeCategory={activeCategory ?? ""}
        setActiveCategory={(id) => setActiveCategory(id as PlayCategory)}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {playbook?.map((play, idx) => (
          <CardContent
            key={idx}
            className="group cursor pointer relative rounded-2xl border border-orange-300/30 bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 shadow-md transition duration-300 hover:border-orange-400/40 hover:shadow-lg"
          >
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
                      play.category === "defense" &&
                        "bg-blue-500/10 text-blue-400",
                      play.category === "SPECIAL" &&
                        "bg-purple-500/10 text-purple-400",
                    )}
                  >
                    {play.category}
                  </span>
                )}
              </div>
            </div>
            <div className="0 relative mb-4 overflow-hidden rounded-xl border border-gray-800 bg-gray-950 transition-all duration-300">
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
                className="flex-1 border border-white/10 bg-white/10 text-white transition hover:bg-white/20 hover:text-orange-400"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              <Button
                size="sm"
                className="flex-1 border border-white/10 bg-white/10 text-white transition hover:bg-white/20 hover:text-orange-400"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardContent>
        ))}
      </div>
    </div>
  );
};

export default PlaybookLibraryPage;
