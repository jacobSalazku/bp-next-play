"use client";

import { Button } from "@/components/button/button";
import { Trophy, Users } from "lucide-react";

type ActivityType = "all" | "game" | "practice";

interface ActivityFilterProps {
  currentFilter: ActivityType;
  onFilterChange: (filter: ActivityType) => void;
}

export function ActivityFilter({
  currentFilter,
  onFilterChange,
}: ActivityFilterProps) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-gray-700">
      {["all", "game", "practice"].map((type) => (
        <Button
          key={type}
          variant={currentFilter === type ? "default" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(type as ActivityType)}
          className="rounded-none"
        >
          {type === "game" ? (
            <Trophy className="mr-1 h-4 w-4" />
          ) : type === "practice" ? (
            <Users className="mr-1 h-4 w-4" />
          ) : null}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      ))}
    </div>
  );
}
