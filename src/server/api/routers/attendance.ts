import { attendanceSchema } from "@/features/attendance/zod";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const attendanceRouter = createTRPCRouter({
  getAttendanceByActivities: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
        teamMemberId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const attendance = await ctx.db.activityAttendance.findFirst({
        where: {
          activityId: input.activityId,
          teamMemberId: input.teamMemberId,
        },
        include: {
          teamMember: {
            include: {
              user: true,
            },
          },
        },
      });
      return attendance;
    }),
  submitAttendance: protectedProcedure
    .input(attendanceSchema)
    .mutation(async ({ ctx, input }) => {
      const attendance = await ctx.db.activityAttendance.upsert({
        where: {
          activityId_teamMemberId: {
            activityId: input.activityId,
            teamMemberId: input.teamMemberId,
          },
        },
        update: {
          attendanceStatus: input.attendanceStatus,
          reason: input.reason,
        },
        create: {
          activityId: input.activityId,
          teamMemberId: input.teamMemberId,
          attendanceStatus: input.attendanceStatus,
          reason: input.reason,
        },
      });
      return attendance;
    }),
});
