import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const teamRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(3, { message: "Team name must be at least 3 characters." }),
        image: z
          .string()
          .url({ message: "Please enter a valid URL." })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const team = await ctx.db.team.create({
        data: {
          name: input.name,
          image: input.image,
          creatorId: userId,
          code: Math.random().toString(36).substring(2, 8),
          createdAt: new Date(),
          members: {
            create: {
              userId: userId,
              role: "Coach", // Or however your roles are represented (e.g., "COACH")
              status: "active", // Set the appropriate status value
            },
          },
        },
        include: {
          members: true,
        },
      });

      return { team };
    }),

  getTeam: protectedProcedure.query(async ({ ctx }) => {
    const team = await ctx.db.team.findFirst({
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        code: true,
        image: true,
      },
    });

    if (!team) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found.",
      });
    }
    return team;
  }),

  getTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.db.team.findMany({
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        code: true,
        image: true,
        createdAt: true,
        creatorId: true,
        activities: {
          select: {
            id: true,
            title: true,
            duration: true,
            date: true,
            time: true,
            type: true,
            practiceType: true,
          },
          orderBy: { date: "desc" },
        },
        members: {
          select: {
            userId: true,
            role: true,
            status: true,
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!teams) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found.",
      });
    }

    return teams;
  }),

  requestToJoin: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: { id: input.teamId },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid team code.",
        });
      }

      // Check if user already requested or is in the team
      const existingRequest = await ctx.db.teamMember.findFirst({
        where: { userId: ctx.session.user.id, teamId: team.id },
      });

      if (existingRequest) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already requested or joined this team.",
        });
      }

      return ctx.db.teamMember.create({
        data: {
          userId: ctx.session.user.id,
          teamId: team.id,
          role: "player",
          status: "pending",
        },
      });
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
        data: { status: "active" },
      });
    }),

  getIncomingRequests: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
          creatorId: ctx.session.user.id, // Ensure the user is the creator
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not authorized to view requests for this team, or the team does not exist.",
        });
      }

      const incomingRequests = await ctx.db.teamMember.findMany({
        where: {
          teamId: input.teamId,
          status: "pending",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true, // Include other user details as needed
            },
          },
        },
      });

      return incomingRequests;
    }),
});
