// Shared header for CodeBloom.
// Edit the header here once and every page that loads this script updates.
(function () {
    var script = document.currentScript;
    var base = script.src.substring(0, script.src.lastIndexOf('/') + 1);

    var html = `
<header class="site-header">
    <a class="logo" href="${base}index.html">
        <img src="${base}logo.png" alt="CodeBloom Logo" class="logo-img">
        <span class="code">Code</span><span class="bloom">Bloom</span>
    </a>

<nav class="navbar" id="navbar">
    <a href="${base}index.html">HOME</a>
    <a href="${base}courses.html">COURSES</a>
    <a href="${base}project.html">PROJECT</a>
    <a href="${base}challenge.html">CHALLENGE</a>
    <a href="${base}about.html">ABOUT</a>
    <a href="${base}contact.html">CONTACT</a>

    <a href="#" id="search-toggle" aria-label="Search">
        <i class="ti ti-search"></i>
    </a>
</nav>

    <div class="search-box" id="search-box">
        <input
            type="text"
            id="search-input"
            placeholder="Search courses and lessons..."
            autocomplete="off"
        >
        <div class="search-results" id="search-results"></div>
    </div>
</header>`;

    var mount = document.getElementById('site-header');
    if (mount) {
        mount.outerHTML = html;
    } else {
        document.body.insertAdjacentHTML('afterbegin', html);
    }

    if (document.body.classList.contains("no-search")) {
    const searchToggle = document.getElementById("search-toggle");
    const searchBox = document.getElementById("search-box");

    if (searchToggle) searchToggle.remove();
    if (searchBox) searchBox.remove();
    }
})();
