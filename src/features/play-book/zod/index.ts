import { z } from "zod";

export const playSchema = z.object({
  name: z.string().min(1, "Play name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  canvas: z.string().min(1, "Canvas data is required"),
});

export type Play = z.infer<typeof playSchema>;

export const gamePlanSchema = z.object({
  name: z.string().min(1, "title is required"),
  opponent: z.string().min(1, "Opponent name is required"),
  notes: z.string(),
  activityId: z.string().optional(),
  playsId: z.array(z.string()),
  teamId: z.string(),
});

export type GamePlanData = z.infer<typeof gamePlanSchema>;
