import { ProgressItemType } from "@prisma/client";
import path from "path";
import fs from "fs";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { UpdateProfileInput } from "../validators/profile.validator";
import { env } from "../config/env";

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

export async function getProfileStats(userId: string) {
  const [user, completedLessons, completedChallenges] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    }),
    prisma.userProgress.findMany({
      where: { userId, itemType: ProgressItemType.lesson },
      select: { itemId: true },
    }),
    prisma.userProgress.count({
      where: { userId, itemType: ProgressItemType.challenge },
    }),
  ]);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const lessonIds = completedLessons.map((item) => item.itemId);
  const lessons = lessonIds.length
    ? await prisma.lesson.findMany({
        where: { id: { in: lessonIds } },
        select: { courseId: true },
      })
    : [];

  const lessonsByCourse: Record<string, number> = {};
  for (const lesson of lessons) {
    lessonsByCourse[lesson.courseId] = (lessonsByCourse[lesson.courseId] ?? 0) + 1;
  }

  return {
    memberSince: user.createdAt,
    totalCompletedLessons: completedLessons.length,
    totalCompletedChallenges: completedChallenges,
    lessonsByCourse,
  };
}

export async function uploadAvatar(userId: string, file: Express.Multer.File) {
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

  const avatarUrl = `${env.FRONTEND_URL}/uploads/avatars/${file.filename}`;

  const updated = await prisma.profile.update({
    where: { userId },
    data: { avatarUrl },
  });

  return updated;
}
