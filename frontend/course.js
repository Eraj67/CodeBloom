const API_BASE = "http://localhost:4000/api";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  if (!courseId) {
    window.location.href = "courses.html";
    return;
  }

  await loadCourse(courseId);
});

async function loadCourse(courseId) {
  try {
    const response = await fetch(`${API_BASE}/courses/${courseId}`);
    if (!response.ok) throw new Error("Failed to load course");

    const data = await response.json();
    const course = data.course;

    document.getElementById("course-title").textContent = course.title;
    document.getElementById("course-description").textContent = course.description;
    document.getElementById("lesson-count").textContent = `${course.lessons.length} LESSONS`;

    const grid = document.getElementById("lessons-grid");
    grid.innerHTML = "";

    course.lessons.forEach((lesson) => {
      const card = document.createElement("a");
      card.href = `lesson.html?id=${lesson.id}`;
      card.className = "card";
      card.style.textDecoration = "none";
      card.style.color = "inherit";
      card.style.display = "block";
      card.innerHTML = `
        <h3>Lesson ${lesson.order}: ${lesson.title}</h3>
        <p style="color: #888; font-size: 14px; margin-top: 8px;">${lesson.description || ""}</p>
        <p style="color: #666; font-size: 13px; margin-top: 8px;">⏱ ${lesson.duration} min</p>
      `;
      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading course:", error);
    document.getElementById("course-title").textContent = "Course not found";
    document.getElementById("lessons-grid").innerHTML = "<p>Failed to load course. Please try again later.</p>";
  }
}
