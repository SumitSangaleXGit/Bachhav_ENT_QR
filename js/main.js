/* ==========================================================================
   Bachhav ENT Hospital & Dental Care Clinic — main.js
   Vanilla JS only. No libraries beyond Bootstrap's own bundle.
   ========================================================================== */
(function () {
  'use strict';

  // Arm the .reveal hiding ONLY from here — if this script never runs,
  // the CSS (html.js-ready .reveal) never applies and all content shows.
  document.documentElement.classList.add('js-ready');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     1. Footer year
     --------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------
     2. Navbar — solid background once the page is scrolled
     --------------------------------------------------------------- */
  var nav = document.getElementById('mainNav');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     3. Auto-close the mobile menu when a link is tapped
        (guarded so a missing Bootstrap bundle can't break the page)
     --------------------------------------------------------------- */
  var navMenu = document.getElementById('navMenu');
  if (navMenu && window.bootstrap && window.bootstrap.Collapse) {
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navMenu.classList.contains('show')) {
          var collapse = bootstrap.Collapse.getOrCreateInstance(navMenu);
          collapse.hide();
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     4. Scroll-reveal via IntersectionObserver
        - Give each group's children a stagger delay (--d) so they
          rise one after another instead of all at once.
     --------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--d', (i * 90) + 'ms');
    });
  });

  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  } else if ('IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    // Ancient browsers: just show everything
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ---------------------------------------------------------------
     5. Smooth-scroll anchor links (native where supported; the
        CSS `scroll-behavior: smooth` + scroll-margin-top handles
        the sticky-nav offset).
     --------------------------------------------------------------- */
  // Placeholder links (href="#") waiting for real URLs — don't jump to top.
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;

      // Only intercept if the browser doesn't already smooth-scroll.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY;
      var offset = targetId === '#top' || targetId === '#home' ? 0 : 84;
      window.scrollTo({ top: Math.max(top - offset, 0), behavior: 'smooth' });
    });
  });

  /* ---------------------------------------------------------------
     6. Day / night toggle
        - The inline <head> script already set data-theme before first
          paint; here we just wire up the button, persist the choice and
          keep <meta name="theme-color"> in sync.
     --------------------------------------------------------------- */
  var themeToggle = document.getElementById('themeToggle');

  function setTheme(theme, save) {
    document.documentElement.setAttribute('data-theme', theme);

    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0c1424' : '#f4f7fb');

    if (save !== false) {
      try { localStorage.setItem('vb-theme', theme); } catch (e) { /* private mode */ }
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
      themeToggle.setAttribute('title', theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next, true);
    });
    // Sync icon/label state with whatever the inline head script chose.
    setTheme(document.documentElement.getAttribute('data-theme') || 'light', false);
  }

})();
