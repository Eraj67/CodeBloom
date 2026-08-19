import { ProgressItemType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";

async function assertItemExists(itemType: ProgressItemType, itemId: string) {
  if (itemType === ProgressItemType.lesson) {
    const lesson = await prisma.lesson.findUnique({ where: { id: itemId } });
    if (!lesson) {
      throw new AppError(404, "Lesson not found");
    }
    return;
  }

  const challenge = await prisma.challenge.findUnique({ where: { id: itemId } });
  if (!challenge) {
    throw new AppError(404, "Challenge not found");
  }
}

export async function listProgress(userId: string) {
  return prisma.userProgress.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    select: {
      itemType: true,
      itemId: true,
      completedAt: true,
    },
  });
}

export async function getCompletionStats(userId: string) {
  const completedLessons = await prisma.userProgress.findMany({
    where: { userId, itemType: ProgressItemType.lesson },
    select: { itemId: true },
  });

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

  const completedChallenges = await prisma.userProgress.count({
    where: { userId, itemType: ProgressItemType.challenge },
  });

  return {
    lessonsByCourse,
    completedChallenges,
    totalCompletedLessons: completedLessons.length,
  };
}

export async function getProgressSummary(userId: string) {
  return getCompletionStats(userId);
}

export async function completeItem(
  userId: string,
  itemType: ProgressItemType,
  itemId: string
) {
  await assertItemExists(itemType, itemId);

  return prisma.userProgress.upsert({
    where: {
      userId_itemType_itemId: { userId, itemType, itemId },
    },
    update: {},
    create: { userId, itemType, itemId },
    select: {
      itemType: true,
      itemId: true,
      completedAt: true,
    },
  });
}
