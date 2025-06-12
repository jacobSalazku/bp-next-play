import {
  getActiveAttendedMember,
  getActiveTeamMembers,
} from "@/server/service/team-service";
import { getAllMembers, getTeamMember } from "@/server/service/user-service";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const memberRouter = createTRPCRouter({
  getTeamMembers: publicProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const team = await getAllMembers(ctx, input.teamId);

      return team.members;
    }),

  getTeamMember: publicProcedure.query(async ({ ctx }) => {
    const teamMember = await getTeamMember(ctx);
    return teamMember;
  }),

  getActiveTeamMembers: publicProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const members = await getActiveTeamMembers(ctx, input.teamId);

      return members;
    }),

  getActiveAttendedMember: publicProcedure
    .input(z.object({ teamId: z.string(), activityId: z.string() }))
    .query(async ({ ctx, input }) => {
      const member = await getActiveAttendedMember(
        ctx,
        input.teamId,
        input.activityId,
      );

      return member;
    }),
});
