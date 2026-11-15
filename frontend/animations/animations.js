/* animations
 */
(function () {
    'use strict';

    var root = document.documentElement;
    var reduce = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Switch animations on right away (before the page is drawn), unless the
    // visitor asked for reduced motion. Safety net: if the page takes more
    // than 3 seconds to get ready, drop back to a plain, fully visible page.
    if (!reduce) {
        root.classList.add('js-anim');
        setTimeout(function () {
            if (!window.__animReady) root.classList.remove('js-anim');
        }, 3000);
    }

    /* ---------------------------------------------------------------
       Menu: highlight the link for the page you are on
    --------------------------------------------------------------- */
    function markActiveNav() {
        var nav = document.getElementById('navbar') || document.querySelector('.navbar');
        if (!nav) return;
        if (nav.querySelector(':scope > a.active')) return;   // page already did it

        var path = decodeURIComponent(location.pathname).toLowerCase();
        var file = path.split('/').pop() || 'index.html';
        var section = file;


        if (path.indexOf('/challengespage/') > -1) section = 'challenge.html';
        else if (path.indexOf('/projectspages/') > -1) section = 'project.html';
        else if (path.indexOf('/courses/') > -1 ||
                 file === 'course.html' || file === 'lesson.html') section = 'courses.html';

        var links = nav.querySelectorAll(':scope > a[href]');
        for (var i = 0; i < links.length; i++) {
            var a = links[i];
            if (a.id === 'search-toggle' || a.getAttribute('href').charAt(0) === '#') continue;
            if (a.pathname.toLowerCase().split('/').pop() === section) {
                a.classList.add('active');
                a.setAttribute('aria-current', 'page');
                break;
            }
        }
    }

    /* ---------------------------------------------------------------
       Scroll reveal
    --------------------------------------------------------------- */
    var REVEAL_TARGETS = [
        '.section-header',
        '.section > .eyebrow',
        '.section > h2',
        '.section > .section-title',
        '.section > .section-description',
        '.grid > *',
        '.about-hero > *',
        '.footer-top > *',
        '.contact-left',
        '.contact-right',
        '.faq-card',
        '[data-reveal]'
    ].join(',');

    function initReveal() {
        if (!('IntersectionObserver' in window)) {
            root.classList.remove('js-anim');
            return;
        }

        var items = document.querySelectorAll(REVEAL_TARGETS);
        var list = [];
        for (var i = 0; i < items.length; i++) {
            var el = items[i];
            // never animate something inside something that is already animating
            if (el.parentElement && el.parentElement.closest('.reveal-item')) continue;
            el.classList.add('reveal-item');
            list.push(el);
        }

        var io = new IntersectionObserver(function (entries) {
            var visible = entries.filter(function (e) { return e.isIntersecting; });
            if (!visible.length) return;

            // things that arrive together animate top-to-bottom, left-to-right
            visible.sort(function (a, b) {
                var A = a.boundingClientRect, B = b.boundingClientRect;
                return (Math.round(A.top / 8) - Math.round(B.top / 8)) || (A.left - B.left);
            });

            visible.forEach(function (entry, n) {
                entry.target.style.setProperty('--d', Math.min(n, 6) * 85 + 'ms');
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

        list.forEach(function (el) { io.observe(el); });
    }

    /* ---------------------------------------------------------------
       Card spotlight (only with a real mouse)
    --------------------------------------------------------------- */
    function initSpotlight() {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        var last = null;
        var scheduled = false;

        document.addEventListener('pointermove', function (e) {
            var target = e.target;
            if (!target || !target.closest) return;
            var card = target.closest('.card, .challenge-card');
            if (!card) return;

            last = { card: card, x: e.clientX, y: e.clientY };
            if (scheduled) return;
            scheduled = true;

            // at most one update per frame
            requestAnimationFrame(function () {
                scheduled = false;
                if (!last) return;
                var r = last.card.getBoundingClientRect();
                last.card.style.setProperty('--mx', (last.x - r.left) + 'px');
                last.card.style.setProperty('--my', (last.y - r.top) + 'px');
                last = null;
            });
        }, { passive: true });
    }

    /* ---------------------------------------------------------------
       Scroll-progress bar
    --------------------------------------------------------------- */
    function initProgress() {
        if (!document.body) return;
        var bar = document.createElement('div');
        bar.className = 'scroll-progress';
        bar.setAttribute('aria-hidden', 'true');
        document.body.appendChild(bar);

        var queued = false;
        function update() {
            queued = false;
            var max = root.scrollHeight - root.clientHeight;
            var y = window.pageYOffset || root.scrollTop || 0;
            var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
            bar.style.setProperty('--p', p.toFixed(4));
            bar.classList.toggle('is-on', max > 0 && y > 12);
        }
        function onScroll() {
            if (!queued) { queued = true; requestAnimationFrame(update); }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    }

    /* ---------------------------------------------------------------
       Start
    --------------------------------------------------------------- */
    function start() {
        markActiveNav();

        // "js-anim" is switched on in <head>; if it is gone (reduce motion,
        // or the page loaded too slowly) the page is simply shown as it is.
        if (reduce || !root.classList.contains('js-anim')) {
            root.classList.remove('js-anim');
            return;
        }

        initReveal();
        initSpotlight();
        initProgress();
        window.__animReady = true;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    window.addEventListener('load', markActiveNav);
})();