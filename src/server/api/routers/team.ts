import { createTeamSchema } from "@/features/auth/zod";
import { requestToJoinTeam } from "@/server/service/team-request-service";
import {
  createNewTeam,
  getActiveTeamMembers,
  getTeam,
  getTeams,
} from "@/server/service/team-service";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const teamRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(z.object(createTeamSchema.shape))
    .mutation(async ({ ctx, input }) => {
      const newTeam = await createNewTeam(ctx, input);

      return newTeam;
    }),

  getTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await getTeam(ctx, input.teamId);
    }),

  getTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await getTeams(ctx);

    return teams;
  }),

  getTeamMembers: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const members = await getActiveTeamMembers(ctx, input.teamId);

      return { members };
    }),

  requestToJoin: protectedProcedure
    .input(z.object({ teamCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const request = await requestToJoinTeam(ctx, input.teamCode);

      return request;
    }),

  acceptMember: protectedProcedure
    .input(z.object({ teamId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: { id: input.teamId },
      });

      if (!team || team.creatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to accept members.",
        });
      }

      //set status to active
      return ctx.db.teamMember.update({
        where: {
          id: `${input.teamId}_${input.userId}`, // Assuming a composite unique ID format
        },
        data: { status: "ACTIVE" },
      });
    }),

  getIncomingRequests: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const incomingRequests = await ctx.db.teamMember.findMany({
        where: {
          teamId: input.teamId,
          status: "PENDING",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return incomingRequests;
    }),
});
