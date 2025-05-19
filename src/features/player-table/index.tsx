'use client";';
import { Button } from "@/components/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TeamInformation, TeamMembers } from "@/types";
import { cn } from "@/utils/tw-merge";
import type { FC } from "react";

type PlayerBlockProps = {
  members: TeamMembers;
  team: TeamInformation;
};

export const PlayerBlock: FC<PlayerBlockProps> = ({ team, members }) => {
  return (
    <Card className="w-full border-gray-500">
      <CardHeader className="min-h-32 md:flex md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-8">
          <CardTitle>{`${team.name}'s players`}</CardTitle>
          <CardDescription>
            Manage your basketball team players and view their details.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200 font-semibold text-gray-600 uppercase">
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="hidden md:table-cell">Position</TableHead>
                <TableHead className="hidden md:table-cell">Height</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members ? (
                members.map((player) => (
                  <TableRow
                    key={player.id}
                    className={cn(
                      "hover:bg-muted/50 cursor-pointer",
                      // selectedPlayer?.id === player.id && sidebarOpen
                      //   ? 'bg-muted'
                      //   : '',
                    )}
                    // onClick={() => handlePlayerClick(player)}
                  >
                    <TableCell className="font-medium">
                      #5{/* {player.jerseyNumber} */}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{player.user.name}</div>
                          <div className="text-muted-foreground hidden text-sm sm:block">
                            {player.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {/* {player.position}  */} SG
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {/* {player.height} */} 5 ft 8
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   handlePlayerClick(player);s
                        // }}
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
  );
};
