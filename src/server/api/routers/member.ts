import { getActiveTeamMembers } from "@/server/service/team-service";
import { getAllMembers, getTeamMember } from "@/server/service/user-service";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const memberRouter = createTRPCRouter({
  getTeamMembers: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const team = await getAllMembers(ctx, input.teamId);

      return team.members;
    }),

  getTeamMember: protectedProcedure.query(async ({ ctx }) => {
    const teamMember = await getTeamMember(ctx);
    return teamMember;
  }),

  getActiveTeamMembers: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const members = await getActiveTeamMembers(ctx, input.teamId);

      return members;
    }),
});
