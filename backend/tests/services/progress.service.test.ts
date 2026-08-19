import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../src/lib/prisma", () => {
  const prisma = {
    userProgress: { findMany: vi.fn(), count: vi.fn(), upsert: vi.fn() },
    lesson: { findUnique: vi.fn(), findMany: vi.fn() },
    challenge: { findUnique: vi.fn() },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
  return { prisma };
});

import { prisma } from "../../src/lib/prisma";
import {
  completeItem,
  getCompletionStats,
  getProgressSummary,
  listProgress,
} from "../../src/services/progress.service";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("listProgress", () => {
  it("returns progress ordered by completion descending", async () => {
    vi.mocked(prisma.userProgress.findMany).mockResolvedValue([{ itemType: "lesson", itemId: "a" }] as any);
    await listProgress("user-1");
    expect(prisma.userProgress.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1" },
        orderBy: { completedAt: "desc" },
      })
    );
  });
});

describe("getCompletionStats", () => {
  it("groups completed lessons by course and counts challenges", async () => {
    vi.mocked(prisma.userProgress.findMany).mockResolvedValue([
      { itemId: "html-lesson-01" },
      { itemId: "html-lesson-02" },
    ] as any);
    vi.mocked(prisma.lesson.findMany).mockResolvedValue([
      { courseId: "html" },
      { courseId: "html" },
    ] as any);
    vi.mocked(prisma.userProgress.count).mockResolvedValue(4);

    const stats = await getCompletionStats("user-1");
    expect(stats).toEqual({
      lessonsByCourse: { html: 2 },
      completedChallenges: 4,
      totalCompletedLessons: 2,
    });
  });

  it("returns empty counts when no lessons are completed", async () => {
    vi.mocked(prisma.userProgress.findMany).mockResolvedValue([] as any);
    vi.mocked(prisma.userProgress.count).mockResolvedValue(0);

    const stats = await getCompletionStats("user-1");
    expect(stats).toEqual({
      lessonsByCourse: {},
      completedChallenges: 0,
      totalCompletedLessons: 0,
    });
    expect(prisma.lesson.findMany).not.toHaveBeenCalled();
  });
});

describe("getProgressSummary", () => {
  it("shares the same completion stats shape", async () => {
    vi.mocked(prisma.userProgress.findMany).mockResolvedValue([{ itemId: "js-lesson-01" }] as any);
    vi.mocked(prisma.lesson.findMany).mockResolvedValue([{ courseId: "javascript" }] as any);
    vi.mocked(prisma.userProgress.count).mockResolvedValue(1);

    const summary = await getProgressSummary("user-1");
    expect(summary.lessonsByCourse).toEqual({ javascript: 1 });
    expect(summary.totalCompletedLessons).toBe(1);
  });
});

describe("completeItem", () => {
  it("throws 404 for a missing lesson", async () => {
    vi.mocked(prisma.lesson.findUnique).mockResolvedValue(null);
    await expect(completeItem("user-1", "lesson", "missing-lesson")).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("throws 404 for a missing challenge", async () => {
    vi.mocked(prisma.challenge.findUnique).mockResolvedValue(null);
    await expect(completeItem("user-1", "challenge", "missing-challenge")).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("upserts progress for an existing lesson", async () => {
    vi.mocked(prisma.lesson.findUnique).mockResolvedValue({ id: "html-lesson-01" } as any);
    vi.mocked(prisma.userProgress.upsert).mockResolvedValue({
      itemType: "lesson",
      itemId: "html-lesson-01",
      completedAt: new Date(),
    } as any);

    await completeItem("user-1", "lesson", "html-lesson-01");
    expect(prisma.userProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_itemType_itemId: { userId: "user-1", itemType: "lesson", itemId: "html-lesson-01" },
        },
        create: { userId: "user-1", itemType: "lesson", itemId: "html-lesson-01" },
      })
    );
  });
});