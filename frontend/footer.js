// Shared footer for CodeBloom.
// Edit the footer here once and every page that loads this script updates.
(function () {
    // Work out where footer.js lives, so links work from any folder depth.
    var script = document.currentScript;
    var base = script.src.substring(0, script.src.lastIndexOf('/') + 1);

    var html = `
<footer class="site-footer">
    <div class="footer-top">
        <div class="footer-brand">
            <h2 class="logo">Code<span style="color:#f6d88f;">Bloom</span></h2>
        </div>

        <div class="footer-col">
            <p class="footer-heading">ABOUT US</p>
            <a href="${base}about.html">About Us</a>
            <a href="${base}contact.html">Contact Us</a>
            <a href="${base}footerlinks/policy.html">Privacy Policy</a>
        </div>

        <div class="footer-col">
            <p class="footer-heading">LESSONS</p>
            <a href="${base}courses/coursespage/htmlcourse.html">HTML</a>
            <a href="${base}courses/coursespage/csscourse.html">CSS</a>
            <a href="${base}courses/coursespage/javascriptcourse.html">JavaScript</a>
            <a href="${base}courses/coursespage/githubcourse.html">GitHub</a>
            <a href="${base}courses/coursespage/responsivedesign.html">Responsive Design</a>
        </div>

        <div class="footer-col">
            <p class="footer-heading">USEFUL LINKS</p>
            <a href="${base}footerlinks/help.html">Help</a>
        </div>

        <div class="footer-socials">
            <a href="#" aria-label="Instagram"><i class="ti ti-brand-instagram"></i></a>
            <a href="#" aria-label="X"><i class="ti ti-brand-x"></i></a>
            <a href="#" aria-label="Facebook"><i class="ti ti-brand-facebook"></i></a>
        </div>
    </div>

    <div class="footer-bottom">
        &copy; CodeBloom ${new Date().getFullYear()}. All rights reserved.
    </div>
</footer>`;

    var mount = document.getElementById('site-footer');
    if (mount) {
        mount.outerHTML = html;
    } else {
        document.body.insertAdjacentHTML('beforeend', html);
    }
})();