import { createTeamSchema } from "@/features/auth/zod";
import { requestToJoinTeam } from "@/server/service/team-request-service";
import {
  createNewTeam,
  getTeam,
  getTeams,
} from "@/server/service/team-service";
import { getTeamRole } from "@/server/service/user-role-service";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const teamRouter = createTRPCRouter({
  getTeamRole: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const role = await getTeamRole(ctx, ctx.session.user.id, input.teamId);
      if (!role) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      return role;
    }),

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

  requestToJoin: protectedProcedure
    .input(
      z.object({
        teamCode: z.string(),
        position: z.string(),
        number: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const request = await requestToJoinTeam(ctx, input);

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
