"use client";

import { Button } from "@/components/foundation/button/button";
import { Tabs, TabsList } from "@/components/foundation/tabs/tab-list";
import { TabsTrigger } from "@/components/foundation/tabs/tabs-trigger";
import type { Play } from "@/types";
import { cn } from "@/utils/tw-merge";
import { Plus } from "lucide-react";
import { type FC, useState } from "react";
import { PlayCard } from "./play-card";

type PlayCategory = "offense" | "defense" | "special";
type PageProps = {
  playbook?: Play;
};
const PlaybookLibraryPage: FC<PageProps> = ({ playbook }) => {
  const [activeCategory, setActiveCategory] = useState<PlayCategory>();

  return (
    <div className="flex flex-col gap-4 space-y-6 overflow-y-auto p-4 sm:p-6">
      <div className="m-0 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Plays Library
          </h1>
        </div>
      </div>
      {/* <PlayCategoryFilter
        activeCategory={activeCategory ?? ""}
        setActiveCategory={(id) => setActiveCategory(id as PlayCategory)}
      /> */}
      <Tabs className="m-0 text-sm">
        <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
          <TabsList className="flex w-full justify-center gap-2 px-0 sm:gap-4">
            <TabsTrigger
              id="team-tab"
              value="team"
              className={cn(
                "group flex w-1/2 flex-1 items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-left transition-colors duration-500 ease-in-out",
                "data-[state=active]:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400",
              )}
            >
              <div className="flex flex-col transition-colors duration-300 ease-in-out">
                <p className="font-semibold">Gameplan</p>
              </div>
            </TabsTrigger>

            <TabsTrigger
              id="players-tab"
              value="players"
              className={cn(
                "group flex w-1/2 flex-1 items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-left transition-colors duration-500 ease-in-out",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400",
              )}
            >
              <div className="flex flex-col transition-colors duration-300 ease-in-out">
                <p className="font-semibold">Practice</p>
              </div>
            </TabsTrigger>
            <TabsTrigger
              id="players-tab"
              value="players"
              className={cn(
                "group flex w-1/2 flex-1 items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-left transition-colors duration-500 ease-in-out",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-400",
              )}
            >
              <div className="flex flex-col transition-colors duration-300 ease-in-out">
                <p className="font-semibold">Playbook</p>
              </div>
            </TabsTrigger>
          </TabsList>
          <Button
            className="w-full bg-orange-500 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-950 sm:w-auto"
            aria-label="Create new play"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Play
          </Button>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8">
        {playbook?.map((play, idx) => <PlayCard key={idx} play={play} />)}
      </div>
    </div>
  );
};

export default PlaybookLibraryPage;
