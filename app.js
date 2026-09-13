/* =======================================================================
   Dijitaldeyiz — Premium Agency JavaScript
   Inspired by Monks.com: Smooth transitions, kinetic interactions,
   and dynamic cursor & parallax effects.
   ======================================================================= */

'use strict';

// ─── DOM READY ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initHeroHeadlines();
  initCounters();
  initTestimonials();
  initVideoModal();
  initContactForm();
  initCursorGlow();
  initKineticScrollParallax();
});

/* ─── NAVBAR SCROLL ──────────────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const update = () => {
    const y = window.scrollY;
    if (y > 60) {
      nav.classList.add('scrolled');
      nav.classList.remove('over-dark');
    } else {
      nav.classList.remove('scrolled');
      nav.classList.add('over-dark');
    }
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ─── MOBILE MENU ────────────────────────────────────────────────────── */
function initMobileMenu() {
  const btn   = document.getElementById('hamburgerBtn');
  const menu  = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const open  = () => {
    menu.classList.add('open');
    btn.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  };
  const toggle = () => menu.classList.contains('open') ? close() : open();

  btn.addEventListener('click', toggle);

  // Close on link click
  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', close);
  });

  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ─── SCROLL REVEAL (Monks-style Staggered Entrances) ──────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.dj-svc-card, .dj-work-item, .dj-why-card, .dj-strip-img, .dj-stat, .dj-about-grid, .dj-section-header, .dj-contact-left, .dj-contact-right, .dj-katalog-hero, .dj-kat-item, .dj-service-highlights-bar, .dj-testi-card, .dj-testi-dots, .dj-reel-content, .dj-footer-brand, .dj-footer-col'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 4 === 1) el.classList.add('reveal-delay-1');
    if (i % 4 === 2) el.classList.add('reveal-delay-2');
    if (i % 4 === 3) el.classList.add('reveal-delay-3');
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ─── HERO HEADLINES CYCLE ─────────────────────────────────────────────────── */
function initHeroHeadlines() {
  const titles = document.querySelectorAll('.dj-hero-headline');
  const wrap = document.querySelector('.dj-hero-headline-wrap');
  if (titles.length < 2) return;

  const syncWrapHeight = () => {
    if (!wrap) return;
    let maxHeight = 0;
    titles.forEach(t => {
      // Temporarily ensure accurate measurement even when inactive
      const prevOpacity = t.style.opacity;
      const prevVis = t.style.visibility;
      t.style.visibility = 'hidden';
      t.style.opacity = '0';
      const h = t.offsetHeight;
      if (h > maxHeight) maxHeight = h;
      t.style.visibility = prevVis;
      t.style.opacity = prevOpacity;
    });
    if (maxHeight > 0) {
      wrap.style.minHeight = `${Math.ceil(maxHeight)}px`;
    }
  };

  syncWrapHeight();
  window.addEventListener('resize', syncWrapHeight, { passive: true });
  setTimeout(syncWrapHeight, 200);

  let currentIndex = 0;
  setInterval(() => {
    // Current one exits
    titles[currentIndex].classList.remove('active');
    titles[currentIndex].classList.add('exiting');
    
    // Wait for exit animation, then clean up and activate next
    setTimeout(() => {
      titles[currentIndex].classList.remove('exiting');
      currentIndex = (currentIndex + 1) % titles.length;
      titles[currentIndex].classList.add('active');
      syncWrapHeight();
    }, 500); // 500ms match with CSS exiting transition
  }, 4500); // cycle every 4.5 seconds
}

/* ─── KINETIC SCROLL PARALLAX ────────────────────────────────────────── */
function initKineticScrollParallax() {
  const tracks = document.querySelectorAll('.dj-bg-kinetic-inner, .dj-kinetic-row-inner');
  if (!tracks.length) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    tracks.forEach((track, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const skewAmount = Math.max(Math.min(delta * 0.08, 4), -4);
      track.style.transform = `skewX(${skewAmount * direction}deg)`;
    });

    clearTimeout(window.skewTimeout);
    window.skewTimeout = setTimeout(() => {
      tracks.forEach(track => {
        track.style.transform = 'skewX(0deg)';
        track.style.transition = 'transform 0.4s ease-out';
      });
    }, 150);

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
}

/* ─── COUNTER ANIMATION ──────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1800;
      const start  = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };

      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

/* ─── TESTIMONIALS SLIDER ────────────────────────────────────────────── */
function initTestimonials() {
  const cards = document.querySelectorAll('.dj-testi-card');
  const dots  = document.querySelectorAll('.dj-testi-dot');
  if (!cards.length) return;

  let current = 0;
  let interval = null;

  const goTo = (idx) => {
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      resetInterval();
    });
  });

  const resetInterval = () => {
    clearInterval(interval);
    interval = setInterval(() => goTo(current + 1), 6000);
  };

  resetInterval();
}

/* ─── VIDEO MODAL ────────────────────────────────────────────────────── */
function initVideoModal() {
  const modal    = document.getElementById('videoModal');
  const playBtn  = document.getElementById('reelPlayBtn');
  const closeBtn = document.getElementById('modalClose');
  const backdrop = document.getElementById('modalBackdrop');
  if (!modal) return;

  const openModal  = () => { modal.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };

  playBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ─── CONTACT FORM (TÜRKÇE KARAKTER VE YAZIM DÜZELTMELERİ İLE) ───────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    // let native mailto handle the submission
  });
}



/* ─── CURSOR GLOW (Monks-style dynamic lighting) ─────────────────────── */
function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return; // Mobil cihazları atla

  const cursor = document.createElement('div');
  cursor.id = 'dj-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(41,182,255,0.07) 0%, rgba(41,182,255,0.02) 45%, transparent 70%);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(cursor);

  let mx = -500, my = -500;
  let cx = -500, cy = -500;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  const animateCursor = () => {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
}

/* ─── UTILS ──────────────────────────────────────────────────────────── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showToast(msg, type = 'success') {
  document.getElementById('dj-toast')?.remove();

  const toast = document.createElement('div');
  toast.id = 'dj-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 99999;
    background: ${type === 'success' ? '#29b6ff' : '#ff4d4d'};
    color: ${type === 'success' ? '#000' : '#fff'};
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    padding: 1rem 1.75rem;
    border-radius: 999px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.4), 0 0 20px ${type === 'success' ? 'rgba(41,182,255,0.4)' : 'rgba(255,77,77,0.4)'};
    animation: toastIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
    max-width: 380px;
    line-height: 1.4;
  `;
  toast.textContent = msg;

  if (!document.getElementById('toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = `@keyframes toastIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`;
    document.head.appendChild(s);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'none';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.4s ease-out';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ─── SMOOTH ANCHOR SCROLL ───────────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
