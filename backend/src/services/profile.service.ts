import path from "path";
import fs from "fs";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { UpdateProfileInput } from "../validators/profile.validator";
import { getCompletionStats } from "./progress.service";

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
      ? { avatarUrl: input.avatarUrl === "" || input.avatarUrl === null ? null : input.avatarUrl }
      : {}),
  };

  return prisma.profile.update({
    where: { userId },
    data,
  });
}

export async function getProfileStats(userId: string) {
  const [user, stats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    }),
    getCompletionStats(userId),
  ]);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return {
    memberSince: user.createdAt,
    ...stats,
  };
}

export async function uploadAvatar(
  userId: string,
  file: Express.Multer.File,
  origin: string
) {
  const profile = await prisma.profile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError(404, "Profile not found");
  }

  if (profile.avatarUrl) {
    const oldFilename = path.basename(profile.avatarUrl);
    const oldPath = path.join(process.cwd(), "uploads", "avatars", oldFilename);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  const avatarUrl = `${origin}/uploads/avatars/${file.filename}`;

  const updated = await prisma.profile.update({
    where: { userId },
    data: { avatarUrl },
  });

  return updated;
}
