import type { UpdateUserData } from "@/features/auth/zod";
import { TeamMemberStatus } from "@/types/enum";
import { TRPCError } from "@trpc/server";
import type { Context } from "../api/trpc";

type User = UpdateUserData & {
  hasOnBoarded: boolean;
};

export async function getUserbyId(ctx: Context) {
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
      dominantHand: true,
      dateOfBirth: true,
      phone: true,
      height: true,
      weight: true,
      createdAt: true,
      updatedAt: true,
      hasOnBoarded: true,
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
      number: true,
      position: true,
      attendances: {
        select: {
          attendanceStatus: true,
          reason: true,
          activity: {
            select: {
              id: true,
              title: true,
              time: true,
              date: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }

  return { user, teamMember };
}

export async function getAllMembers(ctx: Context, teamId: string) {
  const team = await ctx.db.team.findUnique({
    where: { id: teamId },
    select: {
      members: {
        where: { status: TeamMemberStatus.ACTIVE, role: "PLAYER" },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              dominantHand: true,
              dateOfBirth: true,
              phone: true,
              height: true,
              weight: true,
            },
          },
          id: true,
          role: true,
          status: true,
          number: true,
          position: true,
          attendances: {
            select: {
              attendanceStatus: true,
              reason: true,
              activity: {
                select: {
                  id: true,
                  title: true,
                  time: true,
                  date: true,
                },
              },
            },
          },
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
  return team;
}

export async function getTeamMember(ctx: Context) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }
  const teamMember = await ctx.db.teamMember.findFirst({
    where: { userId: ctx.session.user.id },
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
}

export async function updateUser(ctx: Context, input: User) {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }
  const user = await ctx.db.user.update({
    where: { id: ctx.session.user.id },
    data: {
      name: input.name,
      dateOfBirth: input.dateOfBirth ?? undefined,
      phone: input.phone ?? undefined,
      height: input.height ?? undefined,
      weight: input.height ?? undefined,
      dominantHand: input.dominantHand ?? undefined,
      hasOnBoarded: input.hasOnBoarded,
    },
  });
  return { user, success: true };
}

export async function getUserProfile(ctx: Context, userId: string) {
  const user = await ctx.db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      dominantHand: true,
      dateOfBirth: true,
      phone: true,
      height: true,
      weight: true,
      createdAt: true,
      updatedAt: true,
      hasOnBoarded: true,
    },
  });

  const teamMember = await ctx.db.teamMember.findFirst({
    where: { userId: userId },
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
      number: true,
      position: true,
      attendances: {
        select: {
          attendanceStatus: true,
          reason: true,
          activity: {
            select: {
              id: true,
              title: true,
              time: true,
              date: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }

  return { user, teamMember };
}

export async function deleteTeamMember(ctx: Context, userId: string) {
  const teamMember = await ctx.db.user.findUnique({
    where: { id: userId },
  });

  return { success: true, teamMember };
}
