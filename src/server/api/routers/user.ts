import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
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
    return { user, teamMember };
  }),

  getTeamMembers: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: { id: input.teamId },
        select: {
          members: {
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
});
