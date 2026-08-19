import { PrismaClient } from "@prisma/client";

const courses = [
  {
    id: "html",
    title: "HTML",
    description: "Learn the structure of the web with HTML.",
    icon: "ti-file-code",
    order: 1,
    lessons: [
      { id: "html-lesson-01", title: "Introduction to HTML", description: "What is HTML and why it matters", duration: 10, order: 1 },
      { id: "html-lesson-02", title: "HTML Document Structure", description: "Understanding DOCTYPE, html, head, and body tags", duration: 15, order: 2 },
      { id: "html-lesson-03", title: "Headings and Paragraphs", description: "Using h1-h6 and p tags effectively", duration: 12, order: 3 },
      { id: "html-lesson-04", title: "Text Formatting", description: "Bold, italic, underline, and semantic text tags", duration: 15, order: 4 },
      { id: "html-lesson-05", title: "Links and Navigation", description: "Creating hyperlinks with anchor tags", duration: 18, order: 5 },
      { id: "html-lesson-06", title: "Images and Media", description: "Adding images, videos, and audio", duration: 20, order: 6 },
      { id: "html-lesson-07", title: "Lists", description: "Ordered, unordered, and description lists", duration: 15, order: 7 },
      { id: "html-lesson-08", title: "Tables", description: "Creating data tables with rows and columns", duration: 20, order: 8 },
      { id: "html-lesson-09", title: "Forms and Inputs", description: "Building interactive forms", duration: 25, order: 9 },
      { id: "html-lesson-10", title: "Semantic HTML", description: "Using header, nav, main, article, section, footer", duration: 18, order: 10 },
      { id: "html-lesson-11", title: "HTML5 Features", description: "New HTML5 elements and APIs", duration: 20, order: 11 },
      { id: "html-lesson-12", title: "Building a Full Page", description: "Putting it all together", duration: 30, order: 12 },
    ],
  },
  {
    id: "css",
    title: "CSS",
    description: "Style beautiful websites with CSS.",
    icon: "ti-palette",
    order: 2,
    lessons: [
      { id: "css-lesson-01", title: "Introduction to CSS", description: "What is CSS and how it works", duration: 10, order: 1 },
      { id: "css-lesson-02", title: "CSS Syntax and Selectors", description: "Rules, properties, and selector types", duration: 15, order: 2 },
      { id: "css-lesson-03", title: "Colors and Backgrounds", description: "Setting colors, gradients, and backgrounds", duration: 15, order: 3 },
      { id: "css-lesson-04", title: "Text and Fonts", description: "Styling text, fonts, and typography", duration: 18, order: 4 },
      { id: "css-lesson-05", title: "The Box Model", description: "Margin, padding, border, and content", duration: 20, order: 5 },
      { id: "css-lesson-06", title: "Display Property", description: "Block, inline, inline-block, none", duration: 15, order: 6 },
      { id: "css-lesson-07", title: "Positioning", description: "Static, relative, absolute, fixed, sticky", duration: 20, order: 7 },
      { id: "css-lesson-08", title: "Flexbox", description: "One-dimensional layouts with flexbox", duration: 25, order: 8 },
      { id: "css-lesson-09", title: "CSS Grid", description: "Two-dimensional layouts with grid", duration: 25, order: 9 },
      { id: "css-lesson-10", title: "Responsive Design", description: "Media queries and mobile-first approach", duration: 20, order: 10 },
      { id: "css-lesson-11", title: "Transitions and Animations", description: "Adding motion with CSS", duration: 18, order: 11 },
      { id: "css-lesson-12", title: "Transforms", description: "2D and 3D transformations", duration: 15, order: 12 },
      { id: "css-lesson-13", title: "CSS Variables", description: "Custom properties and theming", duration: 15, order: 13 },
      { id: "css-lesson-14", title: "Pseudo-classes and Pseudo-elements", description: ":hover, ::before, ::after, and more", duration: 18, order: 14 },
      { id: "css-lesson-15", title: "Forms Styling", description: "Styling form elements beautifully", duration: 20, order: 15 },
      { id: "css-lesson-16", title: "CSS Best Practices", description: "BEM, naming conventions, organization", duration: 15, order: 16 },
      { id: "css-lesson-17", title: "CSS Frameworks Overview", description: "Introduction to Bootstrap, Tailwind", duration: 15, order: 17 },
      { id: "css-lesson-18", title: "Building a Full Layout", description: "Creating a complete responsive layout", duration: 30, order: 18 },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Make your websites interactive with JavaScript.",
    icon: "ti-code",
    order: 3,
    lessons: [
      { id: "js-lesson-01", title: "Introduction to JavaScript", description: "What is JavaScript and why learn it", duration: 10, order: 1 },
      { id: "js-lesson-02", title: "Variables and Data Types", description: "let, const, var, strings, numbers, booleans", duration: 18, order: 2 },
      { id: "js-lesson-03", title: "Operators", description: "Arithmetic, comparison, logical operators", duration: 15, order: 3 },
      { id: "js-lesson-04", title: "Control Flow", description: "if/else, switch, ternary operator", duration: 18, order: 4 },
      { id: "js-lesson-05", title: "Loops", description: "for, while, do-while, for...of", duration: 20, order: 5 },
      { id: "js-lesson-06", title: "Functions", description: "Function declarations, expressions, arrow functions", duration: 22, order: 6 },
      { id: "js-lesson-07", title: "Arrays", description: "Array methods and iteration", duration: 25, order: 7 },
      { id: "js-lesson-08", title: "Objects", description: "Object literals, methods, and properties", duration: 22, order: 8 },
      { id: "js-lesson-09", title: "DOM Manipulation", description: "Selecting and modifying HTML elements", duration: 25, order: 9 },
      { id: "js-lesson-10", title: "Events", description: "Event listeners and handling user interactions", duration: 20, order: 10 },
      { id: "js-lesson-11", title: "Forms and Validation", description: "Handling form submissions and validation", duration: 22, order: 11 },
      { id: "js-lesson-12", title: "Local Storage", description: "Storing data in the browser", duration: 15, order: 12 },
      { id: "js-lesson-13", title: "Async JavaScript", description: "Callbacks, promises, async/await", duration: 25, order: 13 },
      { id: "js-lesson-14", title: "Fetch API", description: "Making HTTP requests", duration: 22, order: 14 },
      { id: "js-lesson-15", title: "Working with APIs", description: "Consuming REST APIs", duration: 25, order: 15 },
      { id: "js-lesson-16", title: "Error Handling", description: "try/catch and error management", duration: 15, order: 16 },
      { id: "js-lesson-17", title: "ES6+ Features", description: "Destructuring, spread, modules, classes", duration: 25, order: 17 },
      { id: "js-lesson-18", title: "Debugging", description: "Console, breakpoints, debugging tools", duration: 15, order: 18 },
      { id: "js-lesson-19", title: "Regular Expressions", description: "Pattern matching with regex", duration: 18, order: 19 },
      { id: "js-lesson-20", title: "Date and Time", description: "Working with dates in JavaScript", duration: 15, order: 20 },
      { id: "js-lesson-21", title: "JSON", description: "Parsing and stringifying JSON", duration: 12, order: 21 },
      { id: "js-lesson-22", title: "Modules", description: "Import/export and module bundlers", duration: 18, order: 22 },
      { id: "js-lesson-23", title: "Testing Basics", description: "Introduction to unit testing", duration: 20, order: 23 },
      { id: "js-lesson-24", title: "Building a Mini Project", description: "Putting JavaScript skills together", duration: 35, order: 24 },
    ],
  },
  {
    id: "git",
    title: "Git & GitHub",
    description: "Version control and collaboration with Git.",
    icon: "ti-git-branch",
    order: 4,
    lessons: [
      { id: "git-lesson-01", title: "What is Version Control?", description: "Understanding version control systems", duration: 10, order: 1 },
      { id: "git-lesson-02", title: "Installing Git", description: "Setting up Git on your system", duration: 8, order: 2 },
      { id: "git-lesson-03", title: "Git Configuration", description: "Setting up your Git identity", duration: 10, order: 3 },
      { id: "git-lesson-04", title: "Creating a Repository", description: "git init and git clone", duration: 12, order: 4 },
      { id: "git-lesson-05", title: "Basic Git Workflow", description: "add, commit, status, log", duration: 18, order: 5 },
      { id: "git-lesson-06", title: "Branching", description: "Creating and switching branches", duration: 15, order: 6 },
      { id: "git-lesson-07", title: "Merging", description: "Combining branches", duration: 15, order: 7 },
      { id: "git-lesson-08", title: "Remote Repositories", description: "Working with GitHub", duration: 18, order: 8 },
      { id: "git-lesson-09", title: "Pull Requests", description: "Collaborating with pull requests", duration: 15, order: 9 },
      { id: "git-lesson-10", title: "Best Practices", description: "Git workflow and commit conventions", duration: 15, order: 10 },
    ],
  },
  {
    id: "responsive",
    title: "Responsive Design",
    description: "Build websites that work on all devices.",
    icon: "ti-device-mobile",
    order: 5,
    lessons: [
      { id: "resp-lesson-01", title: "What is Responsive Design?", description: "Understanding responsive web design", duration: 10, order: 1 },
      { id: "resp-lesson-02", title: "Viewport Meta Tag", description: "Setting up the viewport", duration: 8, order: 2 },
      { id: "resp-lesson-03", title: "Media Queries", description: "Writing responsive breakpoints", duration: 18, order: 3 },
      { id: "resp-lesson-04", title: "Mobile-First Approach", description: "Designing for mobile first", duration: 15, order: 4 },
      { id: "resp-lesson-05", title: "Fluid Typography", description: "Responsive font sizes", duration: 12, order: 5 },
      { id: "resp-lesson-06", title: "Responsive Images", description: "srcset, sizes, picture element", duration: 18, order: 6 },
      { id: "resp-lesson-07", title: "Flexbox for Responsive Layouts", description: "Using flexbox responsively", duration: 20, order: 7 },
      { id: "resp-lesson-08", title: "Mobile-First Implementation", description: "Building a mobile-first layout", duration: 25, order: 8 },
    ],
  },
];

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
  for (const course of courses) {
    const { lessons, ...courseData } = course;

    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        title: courseData.title,
        description: courseData.description,
        icon: courseData.icon,
        order: courseData.order,
        totalLessons: lessons.length,
      },
      create: {
        ...courseData,
        totalLessons: lessons.length,
        lessons: {
          create: lessons.map((lesson) => ({
            ...lesson,
          })),
        },
      },
    });
  }

  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { id: challenge.id },
      update: challenge,
      create: challenge,
    });
  }

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  console.log(`Seeded ${courses.length} courses with ${totalLessons} lessons and ${challenges.length} challenges.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
