import { playSchema } from "@/features/play-book/zod";
import {
  createPlay,
  deletePlay,
  getPlayById,
  getPlays,
} from "@/server/service/playbook-service";
import { getTeamRole } from "@/server/service/user-role-service";
import { checkCoachPermission } from "@/server/utils";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const playRouter = createTRPCRouter({
  createPlay: protectedProcedure
    .input(
      playSchema.extend({
        teamId: z.string(),
      }),
    )
    .use(async ({ ctx, input, next }) => {
      const role = await getTeamRole(ctx, ctx.session.user.id, input.teamId);
      if (!role || (role.role !== "COACH" && role.role !== "PLAYER")) {
        throw new Error("User role not found or invalid.");
      }
      if (role.role === "PLAYER") {
        throw new Error("You do not have permission to edit this activity.");
      }
      await checkCoachPermission(role.role);
      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const play = await createPlay(ctx, input);

      return play;
    }),

  getAllPlays: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const plays = await getPlays(ctx, input.teamId);

      return plays;
    }),

  deletePlay: protectedProcedure
    .input(z.object({ playId: z.string(), teamId: z.string() }))
    .use(async ({ ctx, input, next }) => {
      const role = await getTeamRole(ctx, ctx.session.user.id, input.teamId);
      if (!role || (role.role !== "COACH" && role.role !== "PLAYER")) {
        throw new Error("User role not found or invalid.");
      }
      if (role.role === "PLAYER") {
        throw new Error("You do not have permission to delete this play.");
      }
      await checkCoachPermission(role.role);
      return next();
    })
    .mutation(async ({ ctx, input }) => {
      const play = await deletePlay(ctx, input.playId, input.teamId);

      return play;
    }),

  getPlayById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const play = await getPlayById(ctx, input.id);

      return play;
    }),
});
