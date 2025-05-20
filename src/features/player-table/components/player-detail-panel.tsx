"use client";

import { Button } from "@/components/button/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { TeamMember } from "@/types";
import { cn } from "@/utils/tw-merge";
import { Calendar, X } from "lucide-react";
import Image from "next/image";

const PlayerDetailPanel = ({
  selectedPlayer,
  closeSidebar,
  navOpen,
  sidebarOpen,
}: {
  closeSidebar: () => void;
  navOpen: boolean;
  sidebarOpen: boolean;
  selectedPlayer: TeamMember;
}) => {
  const isMobile = useIsMobile();
  return (
    <div
      className={cn(
        "will-change-opacity fixed inset-y-0 z-30 transform overflow-y-auto border-r bg-gray-950 opacity-100 shadow-xl transition-all duration-300 ease-in-out will-change-transform",
        isMobile
          ? "w-full"
          : navOpen
            ? "left-64 w-[400px]"
            : "left-16 w-[400px]",
        sidebarOpen
          ? "translate-x-0"
          : isMobile
            ? "-translate-x-full"
            : "-translate-x-full",
      )}
    >
      {selectedPlayer && (
        <div className="flex h-full flex-col">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-bold">Player Details</h2>
            <Button variant="ghost" size="icon" onClick={closeSidebar}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col items-center border-b p-4">
              <Image
                width={200}
                height={200}
                src={selectedPlayer.user.image ?? "/placeholder.svg"}
                alt={selectedPlayer.user.name ?? "Player image"}
                className="h-44 w-44 rounded-full object-cover"
              />
            </div>
            <h3 className="text-center text-2xl font-bold">
              #{selectedPlayer.number} {selectedPlayer.user.name}
            </h3>
            <p className="text-muted-foreground">{selectedPlayer.position}</p>
          </div>
          <Tabs defaultValue="info" className="w-full p-4">
            <TabsList className="grid w-full grid-cols-2">
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
