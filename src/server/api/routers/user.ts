import { updateUserSchema } from "@/features/auth/zod";
import {
  deleteTeamMember,
  getUserbyId,
  getUserProfile,
  updateUser,
} from "@/server/service/user-service";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedUser = await deleteTeamMember(ctx, input.userId);

      return deletedUser;
    }),
});
