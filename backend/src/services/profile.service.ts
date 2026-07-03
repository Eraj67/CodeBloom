import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { UpdateProfileInput } from "../validators/profile.validator";

export async function getProfile(userId: string) {
  const profile = await prisma.profile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError(404, "Profile not found");
  }

  return profile;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const data = {
    ...(input.displayName !== undefined ? { displayName: input.displayName } : {}),
    ...(input.bio !== undefined ? { bio: input.bio } : {}),
    ...(input.avatarUrl !== undefined
      ? { avatarUrl: input.avatarUrl === "" ? null : input.avatarUrl }
      : {}),
  };

  return prisma.profile.update({
    where: { userId },
    data,
  });
}
