import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).nullish(),
  bio: z.string().max(500).nullish(),
  avatarUrl: z.string().url().max(500).or(z.literal("")).nullish(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
