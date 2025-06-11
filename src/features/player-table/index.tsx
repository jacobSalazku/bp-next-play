"use client";

import { Link } from "@/components/foundation/button/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/foundation/card";
import { Table } from "@/components/foundation/table/table";
import { TableBody } from "@/components/foundation/table/table-body";
import { TableCell } from "@/components/foundation/table/table-cell";
import { TableHead } from "@/components/foundation/table/table-head";
import { TableHeader } from "@/components/foundation/table/table-header";
import { TableRow } from "@/components/foundation/table/table-row";
import { useTeam } from "@/context/team-context";
import type { TeamInformation, TeamMember } from "@/types";
import { Copy } from "lucide-react";
import { type FC } from "react";
import { toast } from "sonner";
import { toastStyling } from "../toast-notification/styling";
import { getFullPosition } from "./utils";

type PlayerBlockProps = {
  members: TeamMember[];
  team: TeamInformation;
};

export const PlayerBlock: FC<PlayerBlockProps> = ({ team, members }) => {
  const { teamSlug } = useTeam();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(team.code)
      .then(() => {
        toast.success("Team code copied to clipboard!", toastStyling);
      })
      .catch(() => {
        toast.error("Failed to copy team code.");
      });
  };

  return (
    <>
      <Card className="w-full rounded-2xl border-none py-6 text-white shadow-md transition-all duration-300 md:px-8">
        <CardHeader className="border-b border-orange-200/10 pb-6">
          <div className="flex flex-col gap-4">
            <CardTitle className="font-righteous text-3xl font-semibold tracking-wide">
              {team.name} Players
            </CardTitle>
            <CardDescription className="flex flex-col gap-4 text-sm text-gray-400">
              Manage your basketball team roster and access player details.
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  TeamCode
                  <span
                    onClick={handleCopy}
                    className="cursor-pointer text-sm text-gray-400"
                  >
                    <Copy className="h-4 w-4 cursor-pointer" />
                  </span>
                </div>
              </div>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-800 text-sm tracking-wide text-white uppercase">
                  <TableHead className="w-[60px]">No.</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Position
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Height</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members && members.length > 0 ? (
                  members.map((player) => (
                    <TableRow
                      key={player.id}
                      className="group cursor-pointer border-b border-gray-800 transition-colors hover:bg-orange-200/5"
                    >
                      <TableCell className="py-4 font-semibold">
                        {player.number ? `#${player.number}` : "--"}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-400/20 text-sm font-bold text-white uppercase">
                            {player.user.name?.[0]}
                          </div>
                          <div>
                            <div className="font-medium">
                              {player.user.name}
                            </div>
                            <div className="text-xs text-neutral-400">
                              {player.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {getFullPosition(player.position)}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        {player.user.height}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link
                          aria-label="View Player Profile"
                          href={{
                            pathname: `/${teamSlug}/players/profile`,
                            query: { id: player.user.id },
                          }}
                          variant="default"
                          size="sm"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground py-6 text-center text-sm"
                    >
                      No players found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
