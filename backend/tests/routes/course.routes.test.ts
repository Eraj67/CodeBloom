import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";

vi.mock("../../src/lib/prisma", () => {
  const prisma = {
    course: { findMany: vi.fn(), findUnique: vi.fn() },
    lesson: { findUnique: vi.fn(), findFirst: vi.fn() },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
  return { prisma };
});

import { prisma } from "../../src/lib/prisma";
import { createApp } from "../../src/app";

const app = createApp();

const course = {
  id: "html",
  title: "HTML",
  description: "Learn HTML",
  icon: "ti-file-code",
  totalLessons: 12,
  order: 1,
  lessons: [{ id: "html-lesson-01", title: "Introduction", description: "Start", duration: 10, order: 1 }],
};

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

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/courses", () => {
  it("returns the list of courses", async () => {
    vi.mocked(prisma.course.findMany).mockResolvedValue([course] as any);
    const res = await request(app).get("/api/courses");
    expect(res.status).toBe(200);
    expect(res.body.courses).toHaveLength(1);
    expect(res.body.courses[0].id).toBe("html");
  });
});

describe("GET /api/courses/:courseId", () => {
  it("returns a single course", async () => {
    vi.mocked(prisma.course.findUnique).mockResolvedValue(course as any);
    const res = await request(app).get("/api/courses/html");
    expect(res.status).toBe(200);
    expect(res.body.course.title).toBe("HTML");
  });

  it("returns 404 for an unknown course", async () => {
    vi.mocked(prisma.course.findUnique).mockResolvedValue(null);
    const res = await request(app).get("/api/courses/nope");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/courses/lessons/:lessonId", () => {
  it("routes to the lesson handler, not the course param route", async () => {
    vi.mocked(prisma.course.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.lesson.findUnique).mockResolvedValue(lesson as any);
    vi.mocked(prisma.lesson.findFirst).mockResolvedValue(null);

    const res = await request(app).get("/api/courses/lessons/html-lesson-01");
    expect(res.status).toBe(200);
    expect(res.body.lesson.id).toBe("html-lesson-01");
    expect(res.body.lesson.course.title).toBe("HTML");
    expect(prisma.lesson.findUnique).toHaveBeenCalled();
    expect(prisma.course.findUnique).not.toHaveBeenCalled();
  });

  it("returns 404 for an unknown lesson", async () => {
    vi.mocked(prisma.lesson.findUnique).mockResolvedValue(null);
    const res = await request(app).get("/api/courses/lessons/missing");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Lesson not found");
  });
});