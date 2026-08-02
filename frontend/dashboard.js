const API_BASE = "http://localhost:4000/api";

const courseTotals = {
  html: 12,
  css: 18,
  javascript: 24,
  git: 10,
  responsive: 8,
};

document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = await auth.init();
  if (!isLoggedIn) {
    window.location.href = "auth/auth.html";
    return;
  }

  await loadDashboard();
});

async function loadDashboard() {
  try {
    const [profileRes, statsRes] = await Promise.all([
      fetch(`${API_BASE}/profile/me`, { credentials: "include" }),
      fetch(`${API_BASE}/profile/stats`, { credentials: "include" }),
    ]);

    if (profileRes.ok) {
      const profileData = await profileRes.json();
      const name = profileData.profile?.displayName || auth.user.email.split("@")[0];
      document.getElementById("dashboard-name").textContent = name;
    }

    if (statsRes.ok) {
      const statsData = await statsRes.json();
      const stats = statsData.stats;

      document.getElementById("dash-lessons").textContent = stats.totalCompletedLessons;
      document.getElementById("dash-challenges").textContent = stats.totalCompletedChallenges;
      document.getElementById("dash-courses").textContent = Object.keys(stats.lessonsByCourse).length;

      for (const [courseId, total] of Object.entries(courseTotals)) {
        const completed = stats.lessonsByCourse[courseId] || 0;
        const percentage = total > 0 ? (completed / total) * 100 : 0;

        const countEl = document.getElementById(`${courseId}-count`);
        const progressEl = document.getElementById(`${courseId}-progress`);

        if (countEl) countEl.textContent = `${completed}/${total}`;
        if (progressEl) progressEl.style.width = `${percentage}%`;
      }
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
}
