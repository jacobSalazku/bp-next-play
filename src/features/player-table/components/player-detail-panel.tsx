"use client";

import { Button } from "@/components/foundation/button/button";
import { TabsContent } from "@/components/foundation/table/table-content";
import { Tabs, TabsList } from "@/components/foundation/tabs/tab-list";
import { TabsTrigger } from "@/components/foundation/tabs/tabs-trigger";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/store/use-navigation-store";
import type { TeamMember } from "@/types";
import { Calendar, User, X } from "lucide-react";
import Image from "next/image";
import { getFullPosition } from "../utils";

const PlayerDetailPanel = ({
  selectedPlayer,
}: {
  selectedPlayer: TeamMember;
}) => {
  const { navOpen, playerSideBar, setPlayerSideBar } = useNavigationStore();
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        navOpen ? "left-64s w-[400px]" : "left-16 w-full md:w-[400px]",
        playerSideBar
          ? "-translate-x-14"
          : isMobile
            ? "-translate-x-full"
            : "-translate-x-full",
        "absolute inset-y-0 z-30 h-full transform border-r border-orange-200/20 bg-gray-950 opacity-100 shadow-xl transition-all duration-100 ease-in-out",
      )}
    >
      {selectedPlayer && (
        <>
          <div>
            {/* Header */}
            <div className="sticky top-0 z-10 hidden items-center justify-between border-b border-orange-200/20 bg-gray-950 px-4 py-6 md:flex">
              <h2 className="font-righteous text-xl font-bold">
                Player Details
              </h2>
              <Button
                variant="close"
                size="icon"
                onClick={() => setPlayerSideBar(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center border-b border-orange-200/20 px-6 py-8">
              {selectedPlayer.user.image ? (
                <Image
                  width={128}
                  height={128}
                  src={selectedPlayer.user.image}
                  alt={selectedPlayer.user.name ?? "Player image"}
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-700">
                  <User className="h-16 w-16 text-gray-300" strokeWidth={1} />
                </div>
              )}
              <h3 className="mt-4 text-center text-2xl font-bold">
                #{selectedPlayer.number} {selectedPlayer.user.name}
              </h3>
              <p className="text-sm text-orange-300/80">
                {getFullPosition(selectedPlayer.position)}
              </p>
            </div>
          </div>
          {/* Tabs */}
          <Tabs
            defaultValue="info"
            className="flex flex-col overflow-y-auto px-4 pt-4"
          >
            <TabsList className="grid w-full grid-cols-2 border border-orange-200/20 bg-gray-800">
              <TabsTrigger value="info">Personal Info</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            {/* Personal Info */}
            <TabsContent value="info" className="space-y-5 pt-5">
              <DetailItem
                label="Full Name"
                value={selectedPlayer.user.name ?? "-"}
              />
              <DetailItem
                label="Email"
                value={selectedPlayer.user.email ?? "-"}
              />
              {selectedPlayer.user.dateOfBirth && (
                <DetailItem
                  label="Date of Birth"
                  value={new Date(
                    selectedPlayer.user.dateOfBirth,
                  ).toLocaleDateString()}
                />
              )}
              <DetailItem
                label="Jersey Number"
                value={`#${selectedPlayer.number}`}
              />
              <DetailItem
                label="Position"
                value={`${selectedPlayer.position} - ${getFullPosition(selectedPlayer.position)}`}
              />
              <DetailItem label="Height" value={selectedPlayer.user.height} />
              <DetailItem label="Weight" value={selectedPlayer.user.weight} />
            </TabsContent>

            {/* Attendance Info */}
            <TabsContent value="attendance" className="space-y-4 pt-5">
              <div className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <h4 className="text-sm font-medium">Recent Attendance</h4>
              </div>
              <div className="overflow-x-auto text-sm text-gray-200">
                {/* Replace this with actual content */}
                <p className="text-muted-foreground italic">
                  No data available yet.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="flex flex-col text-sm">
    <h4 className="text-muted-foreground mb-1 font-medium">{label}</h4>
    <p>{value}</p>
  </div>
);

export default PlayerDetailPanel;
