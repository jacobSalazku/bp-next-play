"use client";

import { Button } from "@/components/foundation/button/button";
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
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/store/use-navigation-store";
import type { TeamInformation, TeamMember } from "@/types";
import { useState, type FC } from "react";
import PlayerDetailPanel from "./components/player-detail-panel";
import { getFullPosition } from "./utils";

type PlayerBlockProps = {
  members: TeamMember[];
  team: TeamInformation;
};

export const PlayerBlock: FC<PlayerBlockProps> = ({ team, members }) => {
  const { playerSideBar, setPlayerSideBar, setNavOpen } = useNavigationStore();
  const [selectedPlayer, setSelectedPlayer] = useState<TeamMember | null>(null);

  const handlePlayerClick = (player: TeamMember) => {
    setSelectedPlayer(player);
    setPlayerSideBar(true);
    setNavOpen(false);
  };

  return (
    <>
      <Card
        className={cn(
          playerSideBar && "blur-lg",
          "w-full border-orange-200/20 bg-gray-950 text-white transition-all duration-200 ease-in-out",
        )}
      >
        <CardHeader className="min-h-32 md:flex md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-8">
            <CardTitle className="font-righteous text-3xl">{`${team.name} players`}</CardTitle>
            <CardDescription className="text-md text-white">
              Manage your basketball team players and view their details.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="px-4">
              <TableHeader>
                <TableRow className="font-semibold text-white">
                  <TableHead className="w-[50px] text-white">No.</TableHead>
                  <TableHead className="text-white">Player</TableHead>
                  <TableHead className="text-white md:table-cell">
                    Position
                  </TableHead>
                  <TableHead className="hidden text-white lg:table-cell">
                    Height
                  </TableHead>
                  <TableHead className="hidden text-right lg:table-cell"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border-gray-800">
                {members ? (
                  members.map((player) => (
                    <TableRow
                      key={player.id}
                      className={cn(
                        "cursor-pointer border-gray-800 py-2 hover:bg-orange-200/5",
                        // selectedPlayer?.id === player.id && sidebarOpen
                        //   ? 'bg-muted'
                        //   : '',
                      )}
                      // onClick={() => handlePlayerClick(player)}
                    >
                      <TableCell className="py-8 font-medium">
                        {player.number ? `#${player.number}` : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">
                              {player.user.name}
                            </div>
                            <div className="hidden text-sm text-neutral-400 sm:block">
                              {player.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="lg:table-cell">
                        {getFullPosition(player.position)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {player.user.height}
                      </TableCell>
                      <TableCell className="hidden text-right md:table-cell">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayerClick(player);
                            setNavOpen(false);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground py-8 text-center"
                    >
                      No players found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {playerSideBar && selectedPlayer && (
        <PlayerDetailPanel selectedPlayer={selectedPlayer} />
      )}
    </>
  );
};
