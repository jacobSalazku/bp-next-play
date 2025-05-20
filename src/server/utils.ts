import { TRPCError } from "@trpc/server";

export async function checkCoachPermission(role: "COACH" | "PLAYER") {
  if (role !== "COACH") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to perform this action.",
    });
  }
}
