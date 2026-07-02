import { PrismaClient } from "@prisma/client";

const courses: Record<string, { count: number; prefix: string }> = {
  html: { count: 12, prefix: "Introduction to" },
  css: { count: 18, prefix: "Styling with" },
  javascript: { count: 24, prefix: "JavaScript" },
  git: { count: 10, prefix: "Git" },
  responsive: { count: 8, prefix: "Responsive" },
  projects: { count: 15, prefix: "Project" },
};

const challenges = [
  { id: "html-challenge", title: "HTML Challenge", level: "beginner" },
  { id: "css-challenge", title: "CSS Challenge", level: "beginner" },
  { id: "javascript-challenge", title: "JavaScript Challenge", level: "beginner" },
  { id: "html-forms", title: "HTML Forms", level: "intermediate" },
  { id: "css-grid", title: "CSS Grid", level: "intermediate" },
  { id: "javascript-dom", title: "JavaScript DOM", level: "intermediate" },
  { id: "landing-page", title: "Landing Page", level: "advanced" },
  { id: "css-animation", title: "CSS Animation", level: "advanced" },
  { id: "javascript-api", title: "JavaScript API", level: "advanced" },
];

const prisma = new PrismaClient();

async function main() {
  const lessons = Object.entries(courses).flatMap(([courseId, { count, prefix }]) =>
    Array.from({ length: count }, (_, index) => ({
      id: `${courseId}-lesson-${String(index + 1).padStart(2, "0")}`,
      courseId,
      title: `${prefix} Lesson ${index + 1}`,
      order: index + 1,
    }))
  );

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: lesson,
      create: lesson,
    });
  }

  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { id: challenge.id },
      update: challenge,
      create: challenge,
    });
  }

  console.log(`Seeded ${lessons.length} lessons and ${challenges.length} challenges.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
