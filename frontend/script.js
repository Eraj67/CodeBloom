// ===========================================
// CodeBloom Search
// ===========================================

document.addEventListener("DOMContentLoaded", () => {

    const searchToggle = document.getElementById("search-toggle");
    const searchBox = document.getElementById("search-box");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");


    // ===========================================
    // Open / Close Search Box
    // ===========================================

    searchToggle.addEventListener("click", (event) => {
        event.preventDefault();
        searchBox.classList.toggle("active");

        // Focus input when search box opens
        if (searchBox.classList.contains("active")) {
            searchInput.focus();
        }
    });


    // ===========================================
    // Search Input
    // ===========================================

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();

        // Clear results when input is empty
        if (!query) {
            searchResults.innerHTML = "";
            return;
        }

        // Temporary testing
        console.log("Searching for:", query);

        // Temporary message
        searchResults.innerHTML = `
            <div class="search-message">
                Searching for "<strong>${query}</strong>"...
            </div>
        `;
    });


    // ===========================================
    // Close Search When Clicking Outside
    // ===========================================

    document.addEventListener("click", (event) => {

        if (
            !searchBox.contains(event.target) &&
            !searchToggle.contains(event.target)
        ) {
            searchBox.classList.remove("active");
        }
    });

});

