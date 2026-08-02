const API_BASE = "http://localhost:4000/api";

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
        <h3>${course.title}</h3>
        <p class="section-description">${course.description}</p>
        <p><strong>📚 ${course.totalLessons} Lessons</strong></p>
        <br>
        <a href="course.html?id=${course.id}">Start Learning →</a>
      `;
      grid.appendChild(card);
    });

    const projectsCard = document.createElement("div");
    projectsCard.className = "challenge-card";
    projectsCard.innerHTML = `
      <p class="eyebrow">Advanced</p>
      <h3>Real Projects</h3>
      <p class="section-description">
        Apply your skills by creating complete websites and applications.
      </p>
      <p><strong>📚 15 Projects</strong></p>
      <p><strong>⏱ 3 Hours</strong></p>
      <p><strong>⭐ Beginner</strong></p>
      <br>
      <a href="project.html">Start Learning →</a>
    `;
    grid.appendChild(projectsCard);
  } catch (error) {
    console.error("Error loading courses:", error);
    grid.innerHTML = "<p>Failed to load courses. Please try again later.</p>";
  }
}

function getLevel(lessonCount) {
  if (lessonCount <= 10) return "Beginner";
  if (lessonCount <= 18) return "Intermediate";
  return "Advanced";
}
