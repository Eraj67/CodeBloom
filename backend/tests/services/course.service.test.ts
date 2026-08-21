import { describe, expect, it, vi, beforeEach } from "vitest";

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
import { getCourse, getLesson, listCourses } from "../../src/services/course.service";

const course = {
  id: "html",
  title: "HTML",
  description: "Learn HTML",
  icon: "ti-file-code",
  totalLessons: 12,
  order: 1,
};

const lesson = {
  id: "html-lesson-02",
  courseId: "html",
  title: "HTML Document Structure",
  description: "Understanding DOCTYPE",
  content: null,
  duration: 15,
  order: 2,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("listCourses", () => {
  it("orders courses by their order field", async () => {
    vi.mocked(prisma.course.findMany).mockResolvedValue([course] as any);
    await listCourses();
    expect(prisma.course.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { order: "asc" } })
    );
  });

  it("does not expose the redundant _count aggregation", async () => {
    vi.mocked(prisma.course.findMany).mockResolvedValue([course] as any);
    const courses = await listCourses();
    expect(courses[0]).not.toHaveProperty("_count");
  });
});

describe("getCourse", () => {
  it("throws 404 for an unknown course", async () => {
    vi.mocked(prisma.course.findUnique).mockResolvedValue(null);
    await expect(getCourse("unknown")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("returns the course with lessons ordered", async () => {
    vi.mocked(prisma.course.findUnique).mockResolvedValue({
      ...course,
      lessons: [{ id: "html-lesson-01", order: 1 }],
    } as any);
    const result = await getCourse("html");
    expect(result.id).toBe("html");
    expect(prisma.course.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        include: {
          lessons: expect.objectContaining({ orderBy: { order: "asc" } }),
        },
      })
    );
  });
});

describe("getLesson", () => {
  it("throws 404 for an unknown lesson", async () => {
    vi.mocked(prisma.lesson.findUnique).mockResolvedValue(null);
    await expect(getLesson("unknown")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("attaches the previous and next lessons in the course", async () => {
    vi.mocked(prisma.lesson.findUnique).mockResolvedValue({ ...lesson, course: { id: "html", title: "HTML" } } as any);
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({ id: "html-lesson-01", title: "Introduction to HTML" } as any);
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({ id: "html-lesson-03", title: "Headings" } as any);

    const result = await getLesson("html-lesson-02");
    expect(result.prevLesson?.id).toBe("html-lesson-01");
    expect(result.nextLesson?.id).toBe("html-lesson-03");
  });

  it("returns null prev and next at the edges", async () => {
    vi.mocked(prisma.lesson.findUnique).mockResolvedValue({ ...lesson, course: { id: "html", title: "HTML" } } as any);
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce(null);
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce(null);

    const result = await getLesson("html-lesson-02");
    expect(result.prevLesson).toBeNull();
    expect(result.nextLesson).toBeNull();
  });
});