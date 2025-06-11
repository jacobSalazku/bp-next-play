import { updateUserSchema } from "@/features/auth/zod";
import {
  deleteTeamMember,
  getUserbyId,
  getUserProfile,
  updateUser,
} from "@/server/service/user-service";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { verifyCoachPermission } from "../utils/check-membership";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const { user, teamMember } = await getUserbyId(ctx);

    return { user, teamMember };
  }),

  updateUser: protectedProcedure
    .input(updateUserSchema.extend({ hasOnBoarded: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = await updateUser(ctx, input);

      return user;
    }),

  getUserById: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user, teamMember } = await getUserProfile(ctx, input.userId);

      return { user, teamMember };
    }),
  deleteTeamMember: protectedProcedure
    .input(z.object({ teamMemberId: z.string(), teamId: z.string() }))
    .use(async ({ ctx, input, next }) => {
      await verifyCoachPermission(ctx, input.teamId);
      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const deletedMember = await deleteTeamMember(ctx, input.teamMemberId);

      return deletedMember;
    }),
});
