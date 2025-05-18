import { updateUserSchema } from "@/features/auth/zod";
import {
  getAllMembers,
  getTeamMember,
  getUserbyId,
  updateUser,
} from "@/server/service/user-service";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const { user, teamMember } = await getUserbyId(ctx);

    return { user, teamMember };
  }),

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

  updateUser: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      return await updateUser(ctx, input);
    }),

  // getPendingRequests: protectedProcedure
  //   .input(z.object({ teamId: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const pendingRequests = await ctx.db.teamMember.findMany({
  //       where: {
  //         teamId: input.teamId,
  //         status: TeamMemberStatus.PENDING,
  //       },
  //       select: {
  //         user: {
  //           select: {
  //             id: true,
  //             name: true,
  //             email: true,
  //             image: true,
  //           },
  //         },
  //         id: true,
  //         role: true,
  //         status: true,
  //       },
  //     });

  //     return pendingRequests;
  //   }),
});
