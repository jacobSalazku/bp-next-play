import type { CreateTeamData } from "@/features/auth/zod";
import { TeamMemberRole, TeamMemberStatus } from "@/types/enum";
import { TRPCError } from "@trpc/server";
import type { Context } from "../api/trpc";
import { getUserbyId } from "./user-service";

export async function createNewTeam(ctx: Context, input: CreateTeamData) {
  const { user } = await getUserbyId(ctx);

  const team = await ctx.db.team.create({
    data: {
      name: input.name,
      image: input.image,
      creatorId: user.id,
      code: Math.random().toString(36).substring(2, 8),
      createdAt: new Date(),
      members: {
        create: {
          userId: user.id,
          role: TeamMemberRole.COACH, // Or however your roles are represented (e.g., "COACH")
          status: TeamMemberStatus.ACTIVE, // Set the appropriate status value
        },
      },
    },
    include: {
      members: true,
    },
  });

  return team;
}

export async function getActiveTeamMembers(ctx: Context, teamId: string) {
  const team = await ctx.db.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        where: { status: "ACTIVE", role: "PLAYER" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          statlines: {
            select: {
              id: true,
              fieldGoalsMade: true,
              fieldGoalsMissed: true,
              threePointersMade: true,
              threePointersMissed: true,
              freeThrows: true,
              missedFreeThrows: true,
              assists: true,
              steals: true,
              turnovers: true,
              rebounds: true,
              blocks: true,
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

  const members = team.members.map((member) => ({
    id: member.user.id,
    name: member.user.name,
    image: member.user.image,
    role: member.role,
    status: member.status,
    statlines: member.statlines,
  }));

  return members;
}

export async function getTeams(ctx: Context) {
  const { user } = await getUserbyId(ctx);

  const teams = await ctx.db.team.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
          status: "ACTIVE",
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
}

export async function getTeam(ctx: Context) {
  const { user } = await getUserbyId(ctx);

  const team = await ctx.db.team.findFirst({
    where: {
      members: {
        some: {
          userId: user.id,
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
      message: "No teams where found",
    });
  }

  return team;
}
