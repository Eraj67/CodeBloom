const API_BASE = "http://localhost:4000/api";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const lessonId = urlParams.get("id");

  if (!lessonId) {
    window.location.href = "courses.html";
    return;
  }

  await loadLesson(lessonId);
  await auth.init();
});

async function loadLesson(lessonId) {
  try {
    const response = await fetch(`${API_BASE}/courses/lessons/${lessonId}`);
    if (!response.ok) throw new Error("Failed to load lesson");

    const data = await response.json();
    const lesson = data.lesson;

    document.getElementById("lesson-course").textContent = lesson.course.title.toUpperCase();
    document.getElementById("lesson-title").textContent = lesson.title;
    document.getElementById("lesson-description").textContent = lesson.description || "";
    document.getElementById("lesson-duration").textContent = `⏱ ${lesson.duration} minutes`;

    const contentDiv = document.getElementById("lesson-content");
    if (lesson.content) {
      contentDiv.innerHTML = lesson.content;
    } else {
      contentDiv.innerHTML = `
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 30px; text-align: center;">
          <i class="ti ti-book" style="font-size: 48px; color: #f6d88f; margin-bottom: 16px;"></i>
          <h3 style="margin-bottom: 12px;">Lesson Content Coming Soon</h3>
          <p style="color: #888;">This lesson content is being prepared. Check back soon!</p>
        </div>
      `;
    }

    const prevLink = document.getElementById("prev-lesson");
    const nextLink = document.getElementById("next-lesson");

    if (lesson.prevLesson) {
      prevLink.href = `lesson.html?id=${lesson.prevLesson.id}`;
      prevLink.style.visibility = "visible";
    } else {
      prevLink.style.visibility = "hidden";
    }

    if (lesson.nextLesson) {
      nextLink.href = `lesson.html?id=${lesson.nextLesson.id}`;
      nextLink.style.visibility = "visible";
    } else {
      nextLink.style.visibility = "hidden";
    }

    const completeBtn = document.getElementById("complete-lesson-btn");
    completeBtn.addEventListener("click", () => markLessonComplete(lessonId));
  } catch (error) {
    console.error("Error loading lesson:", error);
    document.getElementById("lesson-title").textContent = "Lesson not found";
    document.getElementById("lesson-content").innerHTML = "<p>Failed to load lesson. Please try again later.</p>";
  }
}

async function markLessonComplete(lessonId) {
  if (!auth.isLoggedIn) {
    alert("Please log in to track your progress.");
    window.location.href = "auth/auth.html";
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/progress/lessons/${lessonId}/complete`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to mark lesson as complete");

    const btn = document.getElementById("complete-lesson-btn");
    btn.innerHTML = '<i class="ti ti-check"></i> Completed!';
    btn.style.background = "#4caf50";
    btn.style.color = "#fff";
    btn.disabled = true;

    alert("Lesson marked as complete!");
  } catch (error) {
    console.error("Error marking lesson complete:", error);
    alert("Failed to mark lesson as complete. Please try again.");
  }
}
