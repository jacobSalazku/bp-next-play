"use client";
import { Button } from "@/components/foundation/button/button";
import { Dribbble, Plus, Shield, Target } from "lucide-react";
import { type FC, useState } from "react";
import { PlayCategoryFilter } from "./play-category-filter";

const categories = [
  {
    id: "offense",
    label: "Offense",
    icon: Dribbble,
    gradient: "bg-gradient-to-bl from-orange-500 to-orange-950",
    border: "border-orange-800/30",
    count: 12,
  },
  {
    id: "defense",
    label: "Defense",
    icon: Shield,
    gradient: "bg-gradient-to-bl from-blue-500 to-blue-950",
    border: "border-blue-800/30",
    count: 8,
  },

  {
    id: "special",
    label: "Special",
    icon: Target,
    gradient: "bg-gradient-to-bl from-purple-500 to-purple-950",
    border: "border-purple-800/30",
    count: 3,
  },
];
type PlayCategory = "offense" | "defense" | "special";

const PlaybookLibraryPage: FC = ({}) => {
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
        categories={categories}
        activeCategory={activeCategory ?? ""}
        setActiveCategory={(id) => setActiveCategory(id as PlayCategory)}
      />
      <div></div>
    </div>
  );
};

export default PlaybookLibraryPage;
