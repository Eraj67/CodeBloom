import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../../src/lib/prisma", () => {
  const prisma = {
    lesson: { findUnique: vi.fn(), findMany: vi.fn() },
    challenge: { findUnique: vi.fn() },
    userProgress: { findMany: vi.fn(), count: vi.fn(), upsert: vi.fn() },
    user: { findUnique: vi.fn() },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
  return { prisma };
});

import { prisma } from "../../src/lib/prisma";
import { createApp } from "../../src/app";
import jwt from "jsonwebtoken";
import { env } from "../../src/config/env";

const app = createApp();

const lesson = {
  id: "html-lesson-01",
  courseId: "html",
  title: "Introduction to HTML",
  description: "What is HTML",
  content: null,
  duration: 10,
  order: 1,
  course: { id: "html", title: "HTML" },
};

function withAuth() {
  const token = jwt.sign({ userId: "user-1", tokenVersion: 0 }, env.JWT_SECRET);
  return { Cookie: `token=${token}` };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(prisma.user.findUnique).mockResolvedValue({ tokenVersion: 0 } as any);
});

describe("GET /api/health", () => {
  it("reports ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("unknown routes", () => {
  it("return 404", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Route not found");
  });
});

describe("GET /api/progress/summary", () => {
  it("returns completion counts by course", async () => {
    vi.mocked(prisma.userProgress.findMany).mockResolvedValue([{ itemId: "html-lesson-01" }] as any);
    vi.mocked(prisma.lesson.findMany).mockResolvedValue([{ courseId: "html" }] as any);
    vi.mocked(prisma.userProgress.count).mockResolvedValue(0);

    const res = await request(app).get("/api/progress/summary").set(withAuth());
    expect(res.status).toBe(200);
    expect(res.body.summary).toEqual({
      lessonsByCourse: { html: 1 },
      completedChallenges: 0,
      totalCompletedLessons: 1,
    });
  });

  it("requires auth", async () => {
    const res = await request(app).get("/api/progress/summary");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/progress/lessons/:lessonId/complete", () => {
  it("marks a lesson complete for an existing lesson", async () => {
    vi.mocked(prisma.lesson.findUnique).mockResolvedValue(lesson as any);
    vi.mocked(prisma.userProgress.upsert).mockResolvedValue({
      itemType: "lesson",
      itemId: "html-lesson-01",
      completedAt: new Date(),
    } as any);

    const res = await request(app)
      .post("/api/progress/lessons/html-lesson-01/complete")
      .set(withAuth());
    expect(res.status).toBe(201);
    expect(res.body.progress.itemId).toBe("html-lesson-01");
  });

  it("returns 404 for an unknown lesson", async () => {
    vi.mocked(prisma.lesson.findUnique).mockResolvedValue(null);
    const res = await request(app)
      .post("/api/progress/lessons/nope/complete")
      .set(withAuth());
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Lesson not found");
  });
});