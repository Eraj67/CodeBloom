var API_BASE = "http://localhost:4000/api"; // var (not const) so several scripts on one page can declare it

document.addEventListener("DOMContentLoaded", async () => {
  await loadCourses();
});

async function loadCourses() {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  try {
    const response = await fetch(`${API_BASE}/courses`);
    if (!response.ok) throw new Error("Failed to load courses");

    const data = await response.json();
    const courses = data.courses;

    grid.innerHTML = "";

    courses.forEach((course) => {
      const card = document.createElement("div");
      card.className = "challenge-card";
      card.innerHTML = `
        <p class="eyebrow">${getLevel(course.totalLessons)}</p>
        <div class="card-head">
          ${courseIcon(course.title)}
          <h3>${course.title}</h3>
        </div>
        <p class="section-description">${course.description}</p>
        <p><strong><svg class="icon icon-sm meta-icon" aria-hidden="true"><use href="#i-courses"/></svg>${course.totalLessons} Lessons</strong></p>
        <br>
        <a href="course.html?id=${course.id}">Start Learning →</a>
      `;
      grid.appendChild(card);
    });

    const projectsCard = document.createElement("div");
    projectsCard.className = "challenge-card";
    projectsCard.innerHTML = `
      <p class="eyebrow">Advanced</p>
      <div class="card-head">
        <span class="icon-tile"><svg class="icon" aria-hidden="true"><use href="#i-projects"/></svg></span>
        <h3>Real Projects</h3>
      </div>
      <p class="section-description">
        Apply your skills by creating complete websites and applications.
      </p>
      <p><strong><svg class="icon icon-sm meta-icon" aria-hidden="true"><use href="#i-courses"/></svg>15 Projects</strong></p>
      <p><strong><svg class="icon icon-sm meta-icon" aria-hidden="true"><use href="#i-clock"/></svg>3 Hours</strong></p>
      <p><strong><svg class="icon icon-sm meta-icon" aria-hidden="true"><use href="#i-level-1"/></svg>Beginner</strong></p>
      <br>
      <a href="project.html">Start Learning →</a>
    `;
    grid.appendChild(projectsCard);
  } catch (error) {
    // Backend unreachable: keep the course cards already on the page
    console.error("Error loading courses:", error);
  }
}

function getLevel(lessonCount) {
  if (lessonCount <= 10) return "Beginner";
  if (lessonCount <= 18) return "Intermediate";
  return "Advanced";
}

// Icon for each course card (falls back to a book icon)
function courseIcon(title) {
  const t = String(title).toLowerCase();
  let icon = "courses";
  if (t.includes("html")) icon = "html";
  else if (t.includes("css")) icon = "css";
  else if (t.includes("javascript")) icon = "javascript";
  else if (t.includes("git")) icon = "git";
  else if (t.includes("responsive")) icon = "responsive";
  return `<span class="icon-tile"><svg class="icon" aria-hidden="true"><use href="#i-${icon}"/></svg></span>`;
}
