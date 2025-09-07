(function() {
  const select = (q, ctx = document) => ctx.querySelector(q);

  const navToggle = select('.nav-toggle');
  const primaryNav = select('#primary-navigation');

  function toggleNav() {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
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
})();
