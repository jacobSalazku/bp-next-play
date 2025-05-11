import { TeamMemberStatus } from "@/types/enum";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not logged in",
      });
    }

    const user = await ctx.db.user.findFirst({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const teamMember = await ctx.db.teamMember.findFirst({
      where: { userId: ctx.session.user.id },
      select: {
        team: {
          select: {
            id: true,
            name: true,
            code: true,
            creatorId: true,
          },
        },
        id: true,
        status: true,
        role: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not logged in",
      });
    }

    return { user, teamMember };
  }),

  getTeamMembers: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: { id: input.teamId },
        select: {
          members: {
            where: { status: TeamMemberStatus.ACTIVE },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              id: true,
              role: true,
              status: true,
            },
          },
        },
      });
      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found.",
        });
      }
      return team.members;
    }),

  getTeamMember: protectedProcedure.query(async ({ ctx }) => {
    const teamMember = await ctx.db.teamMember.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        role: true,
        status: true,

        team: {
          select: {
            id: true,
            name: true,
            code: true,
            creatorId: true,
          },
        },
      },
    });

    if (!teamMember) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team member not found.",
      });
    }

    return teamMember;
  }),

  getPendingRequests: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const pendingRequests = await ctx.db.teamMember.findMany({
        where: {
          teamId: input.teamId,
          status: TeamMemberStatus.PENDING, // or "Pending" if you're using strings
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          id: true,
          role: true,
          status: true,
        },
      });

      return pendingRequests;
    }),
});
