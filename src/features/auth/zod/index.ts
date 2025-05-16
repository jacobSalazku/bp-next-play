import { z } from "zod";

export const joinTeamSchema = z.object({
  teamCode: z
    .string()
    .min(3, { message: "Team name must be at least 3 characters." }),
});

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Team name must be at least 3 characters." }),
  image: z.string().optional(),
});

export type JoinTeamFormData = z.infer<typeof joinTeamSchema>;

export type CreateTeamData = z.infer<typeof createTeamSchema>;
