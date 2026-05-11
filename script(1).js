/* ============================================================
   ATELIER — script.js
   Scroll reveal, nav, mobile menu, Cal.com embed
   ============================================================ */

(function () {
  'use strict';

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
  //  CAL.COM EMBED
  //  -----------------------------------------------------------
  //  1. Cal.com'da bir hesap aç (cal.com/signup).
  //  2. Event Type oluştur: süre 30dk, "between bookings" buffer 30dk,
  //     "Working Hours" içinde Pazar günü işaretsiz bırak.
  //  3. Aşağıdaki iki değeri kendi bilgilerinle değiştir:
  //        CAL_USERNAME = "kullanici-adin"
  //        CAL_EVENT    = "event-slug" (ör: "randevu")
  //  4. Sayfayı kaydedip GitHub'a push'la.
  // ============================================================

  const CAL_USERNAME = 'sami-yusuf-mutlu-cbr6mo';   // <-- DEĞİŞTİR
  const CAL_EVENT    = 'randevu';          // <-- DEĞİŞTİR

  (function initCal(C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal; let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {}; cal.q = cal.q || [];
        d.head.appendChild(d.createElement('script')).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ['initNamespace', namespace]);
        } else { p(cal, ar); }
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  try {
    window.Cal('init', 'atelier', { origin: 'https://cal.com' });

    window.Cal.ns.atelier('inline', {
      elementOrSelector: '#cal-inline',
      calLink: `${CAL_USERNAME}/${CAL_EVENT}`,
      config: { layout: 'month_view', theme: 'dark' }
    });

    window.Cal.ns.atelier('ui', {
      theme: 'dark',
      cssVarsPerTheme: {
        light: {
          'cal-brand': '#c8a373',
          'cal-text': '#1a1a1a'
        },
        dark: {
          'cal-brand': '#c8a373',
          'cal-bg': '#16130f',
          'cal-bg-emphasis': '#1d1916',
          'cal-bg-muted': '#211c18',
          'cal-text': '#f3ede1',
          'cal-text-emphasis': '#ffffff',
          'cal-text-muted': '#a09a90',
          'cal-border': 'rgba(200, 163, 115, 0.18)',
          'cal-border-subtle': 'rgba(200, 163, 115, 0.10)',
          'cal-border-emphasis': 'rgba(200, 163, 115, 0.35)'
        }
      },
      hideEventTypeDetails: false,
      layout: 'month_view'
    });
  } catch (err) {
    console.warn('[Atelier] Cal.com yüklenemedi:', err);
    const target = document.getElementById('cal-inline');
    if (target) {
      target.innerHTML = `
        <div style="padding:3rem 1.5rem; text-align:center;">
          <p style="font-family: var(--font-display); font-size: 1.4rem; color: var(--accent); margin-bottom: 1rem;">
            Randevu sistemi henüz yapılandırılmadı
          </p>
          <p style="color: var(--text-dim); max-width: 480px; margin: 0 auto;">
            <code style="background: var(--bg-3); padding: 2px 6px; border-radius: 3px;">script.js</code>
            dosyasında <code style="background: var(--bg-3); padding: 2px 6px; border-radius: 3px;">CAL_USERNAME</code>
            değerini Cal.com kullanıcı adınla değiştir.
          </p>
        </div>`;
    }
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
