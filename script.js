/**
 * YieldUP Portfolio — script.js
 * Nav, progress bar, scroll reveal, architecture toggle, workflow tabs, keyboard jumps
 */

(function () {
  'use strict';

  const SECTION_IDS = [
    'hero', 'objective', 'architecture', 'features',
    'workflows', 'demo', 'challenges', 'analytics'
  ];

  const progressFill = document.getElementById('progressFill');
  const siteHeader = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.site-nav__list a');
  const revealEls = document.querySelectorAll('.reveal');

  /* ── Scroll progress bar ── */
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
  }

  /* ── Active nav link on scroll ── */
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = SECTION_IDS[0];

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) current = id;
    }

    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === '#' + current;
      link.classList.toggle('is-active', match);
      if (match) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  /* ── IntersectionObserver: section fade-in ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── Architecture toggle ── */
  const archBtns = document.querySelectorAll('.arch-toggle__btn');
  const diagramV1 = document.getElementById('diagram-v1');
  const diagramImproved = document.getElementById('diagram-improved');

  function showArch(version) {
    const isV1 = version === 'v1';
    if (diagramV1) {
      diagramV1.hidden = !isV1;
      diagramV1.classList.toggle('arch-diagram--active', isV1);
    }
    if (diagramImproved) {
      diagramImproved.hidden = isV1;
      diagramImproved.classList.toggle('arch-diagram--active', !isV1);
    }
    archBtns.forEach((btn) => {
      const active = btn.dataset.arch === version;
      btn.classList.toggle('arch-toggle__btn--active', active);
      btn.setAttribute('aria-selected', String(active));
    });
  }

  archBtns.forEach((btn) => {
    btn.addEventListener('click', () => showArch(btn.dataset.arch));
  });

  /* ── Workflow tabs ── */
  const wfTabs = document.querySelectorAll('.workflow-tab');
  const wfPanels = document.querySelectorAll('.workflow-panel');

  function showWorkflow(id) {
    wfTabs.forEach((tab) => {
      const active = tab.dataset.workflow === id;
      tab.classList.toggle('workflow-tab--active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    wfPanels.forEach((panel) => {
      const panelId = 'panel-' + id;
      const active = panel.id === panelId;
      panel.classList.toggle('workflow-panel--active', active);
      panel.hidden = !active;
    });
  }

  wfTabs.forEach((tab) => {
    tab.addEventListener('click', () => showWorkflow(tab.dataset.workflow));
  });

  /* ── Mobile nav toggle ── */
  if (navToggle && siteHeader) {
    navToggle.addEventListener('click', () => {
      const open = siteHeader.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        siteHeader.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Keyboard section jumps: 1–8, ArrowUp/ArrowDown ── */
  function scrollToSection(index) {
    const id = SECTION_IDS[index];
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getCurrentSectionIndex() {
    const scrollPos = window.scrollY + 120;
    let idx = 0;
    SECTION_IDS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) idx = i;
    });
    return idx;
  }

  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 8) {
      e.preventDefault();
      scrollToSection(num - 1);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(getCurrentSectionIndex() + 1, SECTION_IDS.length - 1);
      scrollToSection(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(getCurrentSectionIndex() - 1, 0);
      scrollToSection(prev);
    }
  });

  /* ── Scroll listeners (throttled via rAF) ── */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateProgress();
  updateActiveNav();

  /* Default: improved architecture visible */
  showArch('improved');
})();
