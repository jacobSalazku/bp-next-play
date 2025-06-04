import { z } from "zod";

export const playSchema = z.object({
  name: z.string().min(1, "Play name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  canvas: z.string().min(1, "Canvas data is required"),
});

export type Play = z.infer<typeof playSchema>;
