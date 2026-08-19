import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";

export async function listCourses() {
  return prisma.course.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      icon: true,
      totalLessons: true,
    },
  });
}

export async function getCourse(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          order: true,
        },
      },
    },
  });

  if (!course) {
    throw new AppError(404, "Course not found");
  }

  return course;
}

export async function getLesson(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new AppError(404, "Lesson not found");
  }

  const [prevLesson, nextLesson] = await Promise.all([
    prisma.lesson.findFirst({
      where: { courseId: lesson.courseId, order: { lt: lesson.order } },
      orderBy: { order: "desc" },
      select: { id: true, title: true },
    }),
    prisma.lesson.findFirst({
      where: { courseId: lesson.courseId, order: { gt: lesson.order } },
      orderBy: { order: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  return {
    ...lesson,
    prevLesson,
    nextLesson,
  };
}
