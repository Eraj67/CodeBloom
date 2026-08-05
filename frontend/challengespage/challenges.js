const API_BASE = "http://localhost:4000/api";

document.addEventListener("DOMContentLoaded", async () => {
    await auth.init();
    const completeBtn = document.getElementById("complete-challenge-btn");
    completeBtn.addEventListener("click", () => markChallengeComplete());
});

async function markChallengeComplete() {

    if (!auth.isLoggedIn) {
        alert("Please log in to track your progress.");
        window.location.href = "../auth/auth.html";
        return;
    }

    try {
        const challengeId = document.body.dataset.challengeId;
        const response = await fetch(`${API_BASE}/progress/challenges/${challengeId}/complete`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        if (!response.ok)
            throw new Error("Failed to mark challenge as complete");

        const btn = document.getElementById("complete-challenge-btn");
        btn.innerHTML = '<i class="ti ti-check"></i> Completed!'; btn.style.background = "#4caf50"; btn.style.color = "#fff";btn.disabled = true;
        alert("Challenge marked as complete!");

    } catch (error) {
        console.error("Error marking challenge complete:", error);
        alert("Failed to mark challenge as complete.");
    }
}