/* CodeBloom icons: one script gives any page the whole icon set.
   Use it with:  <svg class="icon"><use href="#i-html"/></svg>
   Add  <script src="icons.js"></script>  right after the <body> tag. */
(function () {
    var script = document.currentScript;
    var base = script ? script.src.substring(0, script.src.lastIndexOf('/') + 1) : '';

    /* load the icon styles next to this file, once */
    if (!document.getElementById('codebloom-icons-css')) {
        var link = document.createElement('link');
        link.id = 'codebloom-icons-css';
        link.rel = 'stylesheet';
        link.href = base + 'icons.css';
        document.head.appendChild(link);
    }

    var sprite = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<symbol id="i-html" viewBox="0 0 48 48"><rect x="5" y="8" width="38" height="32" rx="8" fill="currentColor" fill-opacity=".16"/>
<path d="M5 17h38"/><path d="M19 24l-5 5 5 5"/><path d="M29 24l5 5-5 5"/><path d="M26.5 22.5l-3 13"/></symbol>
<symbol id="i-css" viewBox="0 0 48 48"><path d="M18 8c-4 0-6 2-6 6v5c0 3-1.5 5-4.5 5 3 0 4.5 2 4.5 5v5c0 4 2 6 6 6"/>
<path d="M30 8c4 0 6 2 6 6v5c0 3 1.5 5 4.5 5-3 0-4.5 2-4.5 5v5c0 4-2 6-6 6"/>
<circle cx="24" cy="24" r="5" fill="currentColor" fill-opacity=".16"/><circle cx="24" cy="24" r="1.2" fill="currentColor" stroke="none"/></symbol>
<symbol id="i-javascript" viewBox="0 0 48 48"><rect x="5" y="5" width="38" height="38" rx="10" fill="currentColor" fill-opacity=".16"/>
<path d="M20 15v13c0 3-2 5-5 5s-5-1.5-5-4"/>
<path d="M38 18c-.8-2-2.6-3-5-3-3 0-5 1.6-5 4s2 3.4 5 4.2S38 24.6 38 28.6 36 33 33 33s-4.6-1.2-5.4-3.2"/></symbol>
<symbol id="i-projects" viewBox="0 0 48 48"><path d="M6 14a3 3 0 0 1 3-3h9l4 5h17a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3Z" fill="currentColor" fill-opacity=".16"/>
<path d="M24 35V27"/><path d="M24 29c0-4-3-6.5-7.5-6.5 0 4 3 6.5 7.5 6.5Z"/><path d="M24 27c0-3.5 2.5-5.5 6.5-5.5 0 3.5-2.5 5.5-6.5 5.5Z"/></symbol>
<symbol id="i-courses" viewBox="0 0 48 48"><path d="M24 14c-4-3-10-4-17-3v25c7-1 13 0 17 3 4-3 10-4 17-3V11c-7-1-13 0-17 3Z" fill="currentColor" fill-opacity=".16"/>
<path d="M24 14v25"/></symbol>
<symbol id="i-profile" viewBox="0 0 48 48"><circle cx="24" cy="16" r="8" fill="currentColor" fill-opacity=".16"/>
<path d="M8 41c0-9 7-14 16-14s16 5 16 14"/></symbol>
<symbol id="i-share" viewBox="0 0 48 48"><circle cx="11" cy="24" r="5" fill="currentColor" fill-opacity=".16"/><circle cx="36" cy="11" r="5" fill="currentColor" fill-opacity=".16"/><circle cx="36" cy="37" r="5" fill="currentColor" fill-opacity=".16"/>
<path d="M15.5 21.5l16-8.5"/><path d="M15.5 26.5l16 8.5"/></symbol>
<symbol id="i-challenge" viewBox="0 0 48 48"><rect x="6" y="9" width="36" height="33" rx="7" fill="currentColor" fill-opacity=".16"/>
<path d="M6 19h36"/><path d="M16 5v8"/><path d="M32 5v8"/>
<path d="M26.5 23.5 19 32h5l-1.5 7 8-9.5h-5Z"/></symbol>
<symbol id="i-leaderboard" viewBox="0 0 48 48"><rect x="5" y="29" width="12" height="13" rx="2.5"/>
<rect x="18" y="20" width="12" height="22" rx="2.5" fill="currentColor" fill-opacity=".16"/>
<rect x="31" y="26" width="12" height="16" rx="2.5"/>
<path d="M24 5l1.9 3.8 4.1.6-3 2.9.7 4.1-3.7-2-3.7 2 .7-4.1-3-2.9 4.1-.6Z"/></symbol>
<symbol id="i-streak" viewBox="0 0 48 48"><path d="M24 5c.6 8 11 12 11 23a11 11 0 0 1-22 0c0-5 2-8 5-10 0 3 1.2 5 3.2 6C20 17 21.5 10 24 5Z" fill="currentColor" fill-opacity=".16"/>
<path d="M24 40a4.5 4.5 0 0 1-4.5-4.5c0-3 2-4.5 4.5-7.5 2.5 3 4.5 4.5 4.5 7.5A4.5 4.5 0 0 1 24 40Z"/></symbol>
<symbol id="i-badge" viewBox="0 0 48 48"><path d="M15 5l6 13"/><path d="M33 5l-6 13"/>
<circle cx="24" cy="29" r="12" fill="currentColor" fill-opacity=".16"/>
<path d="M24 22.5l2.1 4.2 4.6.7-3.3 3.2.8 4.6-4.2-2.2-4.2 2.2.8-4.6-3.3-3.2 4.6-.7Z"/></symbol>
<symbol id="i-newsletter" viewBox="0 0 48 48"><rect x="5" y="10" width="38" height="28" rx="7" fill="currentColor" fill-opacity=".16"/>
<path d="M7.5 14.5 24 27l16.5-12.5"/></symbol>
<symbol id="i-calculator" viewBox="0 0 48 48"><rect x="8" y="5" width="32" height="38" rx="6" fill="currentColor" fill-opacity=".16"/>
<rect x="14" y="11" width="20" height="8" rx="2"/>
<path d="M17 27h.01"/><path d="M24 27h.01"/><path d="M31 27h.01"/><path d="M17 35h.01"/><path d="M24 35h.01"/><path d="M31 35h.01"/></symbol>
<symbol id="i-git" viewBox="0 0 48 48"><circle cx="13" cy="11" r="4.5" fill="currentColor" fill-opacity=".16"/><circle cx="13" cy="37" r="4.5" fill="currentColor" fill-opacity=".16"/><circle cx="35" cy="19" r="4.5" fill="currentColor" fill-opacity=".16"/>
<path d="M13 15.5v17"/><path d="M35 23.5c0 7-9 8-18.5 11"/></symbol>
<symbol id="i-responsive" viewBox="0 0 48 48"><rect x="5" y="9" width="27" height="21" rx="4" fill="currentColor" fill-opacity=".16"/>
<path d="M13 40h11"/><path d="M18.5 30v10"/>
<rect x="34" y="18" width="9" height="20" rx="3"/><path d="M38.5 34h.01"/></symbol>
<symbol id="i-weather" viewBox="0 0 48 48"><circle cx="34" cy="14" r="6" fill="currentColor" fill-opacity=".16"/><path d="M34 3v2.5"/><path d="M44 14h-2.5"/><path d="M41 7l-1.8 1.8"/><path d="M27 7l1.8 1.8"/>
<path d="M13 41a8 8 0 0 1-.6-15.9A10.5 10.5 0 0 1 32.5 27 6.8 6.8 0 0 1 32 41Z" fill="currentColor" fill-opacity=".16"/></symbol>
<symbol id="i-todo" viewBox="0 0 48 48"><rect x="8" y="6" width="32" height="36" rx="7" fill="currentColor" fill-opacity=".16"/>
<path d="M16 19l3.5 3.5L26 16"/><path d="M16 33h16"/></symbol>
<symbol id="i-grid" viewBox="0 0 48 48"><rect x="6" y="6" width="16" height="16" rx="4" fill="currentColor" fill-opacity=".16"/><rect x="26" y="6" width="16" height="16" rx="4"/><rect x="6" y="26" width="16" height="16" rx="4"/><rect x="26" y="26" width="16" height="16" rx="4"/></symbol>
<symbol id="i-target" viewBox="0 0 48 48"><circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="10" fill="currentColor" fill-opacity=".16"/><circle cx="24" cy="24" r="2" fill="currentColor" stroke="none"/></symbol>
<symbol id="i-rocket" viewBox="0 0 48 48"><path d="M24 5c7 5 10 12 10 20l-5 6H19l-5-6c0-8 3-15 10-20Z" fill="currentColor" fill-opacity=".16"/><circle cx="24" cy="20" r="3.5"/><path d="M19 31l-6 6 1-8"/><path d="M29 31l6 6-1-8"/><path d="M24 35v7"/></symbol>
<symbol id="i-cart" viewBox="0 0 48 48"><path d="M13 14h30l-4 16H17Z" fill="currentColor" fill-opacity=".16"/><path d="M4 6h6l7.5 26H38"/><circle cx="19" cy="40" r="3"/><circle cx="35" cy="40" r="3"/></symbol>
<symbol id="i-clock" viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="currentColor" fill-opacity=".16"/><path d="M24 13v11l7 4"/></symbol>
<symbol id="i-level-1" viewBox="0 0 48 48"><rect x="4" y="28" width="12" height="14" rx="3" fill="currentColor"/><rect x="18" y="16" width="12" height="26" rx="3" opacity=".3"/><rect x="32" y="4" width="12" height="38" rx="3" opacity=".3"/></symbol>
<symbol id="i-level-2" viewBox="0 0 48 48"><rect x="4" y="28" width="12" height="14" rx="3" fill="currentColor"/><rect x="18" y="16" width="12" height="26" rx="3" fill="currentColor"/><rect x="32" y="4" width="12" height="38" rx="3" opacity=".3"/></symbol>
<symbol id="i-level-3" viewBox="0 0 48 48"><rect x="4" y="28" width="12" height="14" rx="3" fill="currentColor"/><rect x="18" y="16" width="12" height="26" rx="3" fill="currentColor"/><rect x="32" y="4" width="12" height="38" rx="3" fill="currentColor"/></symbol>
<symbol id="i-search" viewBox="0 0 48 48"><circle cx="21" cy="21" r="12" fill="currentColor" fill-opacity=".16"/><path d="M30 30l11 11"/></symbol>
</svg>
`;

    function mount() {
        if (document.getElementById('codebloom-icon-sprite')) return;
        var holder = document.createElement('div');
        holder.id = 'codebloom-icon-sprite';
        holder.innerHTML = sprite;
        document.body.insertBefore(holder, document.body.firstChild);
    }

    if (document.body) { mount(); }
    else { document.addEventListener('DOMContentLoaded', mount); }
})();
