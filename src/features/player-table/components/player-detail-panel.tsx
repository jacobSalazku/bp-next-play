"use client";

import { Button } from "@/components/foundation/button/button";
import { Tabs, TabsList } from "@/components/foundation/tabs/tab-list";
import { TabsContent } from "@/components/foundation/tabs/tabs-content";
import { TabsTrigger } from "@/components/foundation/tabs/tabs-trigger";
import {
  playerAttendanceStatus,
  playerAttendanceStatusColor,
} from "@/features/attendance/utils/attendance-status";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { format } from "date-fns";
import { Calendar, User as UserICon } from "lucide-react";
import Image from "next/image";
import { getFullPosition } from "../utils";
import { PlayerDetailItem } from "./player-detail-item";

const PlayerDetailPanel = ({ selectedPlayer }: { selectedPlayer: User }) => {
  if (!selectedPlayer) {
    return <div className="p-6 text-center text-white">Player not found.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10 text-white">
      <div className="mb-8 flex items-center justify-between border-b border-orange-200/30 pb-6">
        <h1 className="font-righteous text-2xl font-bold">Player Details</h1>
        <div className="flex gap-3">
          <Button
            variant="danger"
            size="sm"
            // onClick={() => setIsEditing((prev) => !prev)}
          >
            Kick off Team
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center border-b border-orange-200/30 pb-10">
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
            <UserICon className="h-16 w-16 text-gray-300" strokeWidth={1} />
          </div>
        )}
        <h2 className="mt-4 text-center text-2xl font-bold">
          #{selectedPlayer.teamMember?.number} {selectedPlayer.user.name}
        </h2>
        <p className="text-sm text-orange-300/80">
          {getFullPosition(selectedPlayer.teamMember?.position ?? null)}
        </p>
      </div>

      <Tabs defaultValue="info" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 border border-orange-200/30 bg-gray-800">
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6 space-y-5">
          <PlayerDetailItem
            label="Full Name"
            value={selectedPlayer.user.name}
          />
          <PlayerDetailItem label="Email" value={selectedPlayer.user.email} />
          {selectedPlayer.user.dateOfBirth && (
            <PlayerDetailItem
              label="Date of Birth"
              value={new Date(
                selectedPlayer.user.dateOfBirth,
              ).toLocaleDateString()}
            />
          )}
          <PlayerDetailItem
            label="Jersey Number"
            value={`#${selectedPlayer.teamMember?.number ?? "N/A"}`}
          />
          <PlayerDetailItem
            label="Position"
            value={`${selectedPlayer.teamMember?.number} - ${getFullPosition(selectedPlayer.teamMember?.position ?? null)}`}
          />
          <PlayerDetailItem label="Height" value={selectedPlayer.user.height} />
          <PlayerDetailItem label="Weight" value={selectedPlayer.user.weight} />
        </TabsContent>

        <TabsContent value="attendance" className="mt-6 space-y-4">
          <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4" />
            <h4>Recent Attendance</h4>
          </div>
          <div className="overflow-x-auto text-sm text-gray-200">
            {selectedPlayer.teamMember?.attendances &&
            selectedPlayer.teamMember?.attendances.length > 0 ? (
              selectedPlayer.teamMember.attendances.map((attendance, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-800 py-3"
                >
                  <div className="inline-flex gap-2 font-semibold">
                    <span>{attendance.activity.time}</span>
                    <span>{format(attendance.activity.date, "MMM dd")}</span>
                  </div>
                  <span
                    className={cn(
                      playerAttendanceStatusColor(attendance.attendanceStatus),
                      "rounded-3xl px-4 py-1",
                    )}
                  >
                    {playerAttendanceStatus(attendance.attendanceStatus)}
                  </span>
                  {attendance.reason && (
                    <span className="text-gray-400">({attendance.reason})</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground italic">
                No data available yet.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlayerDetailPanel;
