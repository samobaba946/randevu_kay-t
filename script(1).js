/* ============================================================
   ATELIER — script.js
   Scroll reveal, nav, mobile menu, Cal.com embed
   ============================================================ */

(function () {
  'use strict';

  // Signal to CSS that JS is running (enables reveal animations).
  // If JS fails/blocks for any reason, content stays visible without animations.
  document.documentElement.classList.add('js-ready');

  // ----- Year in footer -----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Hero entrance animation (on load) -----
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('is-loaded'));
  }

  // ----- Navbar scroll state -----
  const nav = document.getElementById('nav');
  let lastScroll = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
    lastScroll = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Mobile menu -----
  const burger = document.getElementById('navBurger');
  const navLinks = document.querySelector('.nav__links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----- Scroll-triggered reveal -----
  // Skip in-hero reveals (those animate on load)
  const reveals = Array.from(document.querySelectorAll('.reveal'))
    .filter(el => !el.closest('.hero'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Slight stagger when several reveal elements enter together
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.querySelectorAll(':scope > .reveal'))
            : [entry.target];
          const i = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = (i >= 0 ? Math.min(i, 6) * 80 : 0) + 'ms';
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => io.observe(el));
  } else {
    // Fallback: just show everything
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // ============================================================
  //  CAL.COM IFRAME EMBED
  //  -----------------------------------------------------------
  //  En basit ve güvenilir yöntem: doğrudan iframe.
  //  Sadece kullanıcı adı + event slug'ı değiştir.
  // ============================================================

  const CAL_USERNAME = 'sami-yusuf-mutlu-cbr6mo';   // Cal.com kullanıcı adın
  const CAL_EVENT    = 'randevu';                    // Cal.com event slug

  const calTarget = document.getElementById('cal-inline');
  if (calTarget) {
    const calUrl = `https://cal.com/${CAL_USERNAME}/${CAL_EVENT}?embed=true&theme=dark`;
    calTarget.innerHTML = `
      <iframe
        src="${calUrl}"
        width="100%"
        height="720"
        frameborder="0"
        style="border: 0; min-height: 720px; width: 100%; display: block;"
        title="Atelier Randevu Sistemi"
        allow="payment; clipboard-write"
        loading="lazy">
      </iframe>`;
  }

  // ----- Anchor smooth scroll offset for sticky nav -----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
