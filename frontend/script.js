const searchInput = document.getElementById("challengeSearch");
const challenges = document.querySelectorAll(".challenge-card");

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    challenges.forEach(challenge => {
        const text = challenge.textContent.toLowerCase();

        if (text.includes(searchTerm)) {
            challenge.style.display = "block";
        } else {
            challenge.style.display = "none";
        }
    });
});

