"use client";

import { Button } from "@/components/button/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { TeamMember } from "@/types";
import { cn } from "@/utils/tw-merge";

import { useNavigationStore } from "@/store/use-navigation-store";
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
        navOpen ? "left-64 w-[400px]" : "w-full md:left-16 md:w-[400px]",
        playerSideBar
          ? "translate-x-0"
          : isMobile
            ? "-translate-x-full"
            : "-translate-x-full",
        "fixed inset-y-0 z-30 transform border-r border-orange-200/20 bg-gray-950 opacity-100 shadow-xl transition-all duration-100 ease-in-out",
      )}
    >
      {selectedPlayer && (
        <div className="flex h-full flex-col text-white">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-orange-200/20 px-4 py-6">
            <h2 className="font-righteous text-xl font-bold">Player Details</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPlayerSideBar(!playerSideBar)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex flex-col overflow-auto border-b border-orange-200/20 py-8">
            <div className="flex flex-col items-center p-4">
              {selectedPlayer.user.image ? (
                <Image
                  width={150}
                  height={150}
                  src={selectedPlayer.user.image ?? "/placeholder.svg"}
                  alt={selectedPlayer.user.name ?? "Player image"}
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <User
                  strokeWidth={1}
                  className="h-32 w-32 rounded-full bg-gray-400"
                />
              )}
            </div>
            <h3 className="text-center text-2xl font-bold">
              #{selectedPlayer.number} {selectedPlayer.user.name}
            </h3>
            <p className="text-center text-orange-300/80">
              {getFullPosition(selectedPlayer.position)}
            </p>
          </div>
          <Tabs defaultValue="info" className="w-full p-4">
            <TabsList className="grid w-full grid-cols-2 border border-orange-200/20 bg-gray-800">
              <TabsTrigger value="info">Personal Info</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                    Full Name
                  </h4>
                  <p>{selectedPlayer.user.name}</p>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                    Email
                  </h4>
                  <p>{selectedPlayer.user.email}</p>
                </div>
                {selectedPlayer.user.dateOfBirth && (
                  <div>
                    <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                      Date of Birth
                    </h4>
                    <p>
                      {new Date(
                        selectedPlayer.user.dateOfBirth,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                    Jersey Number
                  </h4>
                  <p>#{selectedPlayer.number}</p>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                    Position
                  </h4>
                  <p>{selectedPlayer.position}</p>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                    Height
                  </h4>
                  <p>{selectedPlayer.user.height}</p>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                    Weight
                  </h4>
                  <p>{selectedPlayer.user.weight}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="attendance" className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <h4 className="text-sm font-medium">Recent Attendance</h4>
                </div>
                <div className="overflow-x-auto">
                  {/* <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPlayer.attendance.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {new Date(record.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  record.status === "present"
                                    ? "success"
                                    : "destructive"
                                }
                              >
                                {record.status === "present"
                                  ? "Present"
                                  : "Absent"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table> */}
                </div>

                {/* <div className="text-muted-foreground text-sm">
                    Attendance Rate:{" "}
                    {Math.round(
                      (selectedPlayer.attendance.filter(
                        (a) => a.status === "present",
                      ).length /
                        selectedPlayer.attendance.length) *
                        100,
                    )}
                    %
                  </div> */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default PlayerDetailPanel;
