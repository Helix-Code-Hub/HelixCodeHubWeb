(function() {
  const select = (q, ctx = document) => ctx.querySelector(q);

  const navToggle = select('.nav-toggle');
  const primaryNav = select('#primary-navigation');

  function toggleNav() {
    const isOpen = primaryNav.classList.toggle('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }

  // Smooth scrolling for in-page links
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.length === 1) return; // skip '#'

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.pageYOffset - 64;
    window.scrollTo({ top: y, behavior: 'smooth' });

    // Close mobile nav after navigation
    if (primaryNav.classList.contains('open')) toggleNav();
  });

  // Dynamic year in footer
  const yearEl = select('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme toggle with persistence and Safari compatibility
  const root = document.documentElement;
  const toggleBtn = select('#theme-toggle');
  const themeMeta = select('meta#theme-color');
  const THEME_KEY = 'hch-theme';

  function setThemeColor(theme) {
    if (!themeMeta) return;
    const color = theme === 'dark' ? '#0b0b0f' : '#ffffff';
    themeMeta.setAttribute('content', color);
  }

  function styleNavToggle(theme) {
    if (!navToggle) return;
    try {
      // Remove blur on iOS to avoid white fill bug
      navToggle.style.backdropFilter = '';
      navToggle.style.webkitBackdropFilter = '';
      navToggle.style.webkitAppearance = 'none';
      navToggle.style.appearance = 'none';
      if (theme === 'dark') {
        navToggle.style.background = 'rgba(28,28,34,0.92)';
        navToggle.style.borderColor = 'rgba(255,255,255,0.14)';
        navToggle.style.color = '#ffffff';
      } else {
        navToggle.style.background = 'rgba(255,255,255,0.88)';
        navToggle.style.borderColor = 'rgba(0,0,0,0.12)';
        navToggle.style.color = '#1d1d1f';
      }
    } catch (_) {}
  }

  function applyTheme(theme) {
    if (!theme) return;
    root.setAttribute('data-theme', theme);
    root.classList.toggle('theme-dark', theme === 'dark');
    root.classList.toggle('theme-light', theme === 'light');
    setThemeColor(theme);
    styleNavToggle(theme);
    if (toggleBtn) {
      const isDark = theme === 'dark';
      toggleBtn.setAttribute('aria-pressed', String(isDark));
      toggleBtn.textContent = isDark ? '☀︎' : '☾';
      toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      toggleBtn.title = isDark ? 'Light mode' : 'Dark mode';
    }
  }

  // Initialize from localStorage; default to light
  const stored = localStorage.getItem(THEME_KEY);
  applyTheme(stored || 'light');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || (root.classList.contains('theme-dark') ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
    });
  }
})();
