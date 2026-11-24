/* =========================================================
   DH ACADEMY — animations (GSAP + ScrollTrigger + SplitText, Lenis)
   Principe : mouvements calmes et lents, au service de la lecture.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WA = '2290199563785';
  let lenis = null;

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- WhatsApp forms ---------- */
  $$('[data-wa-form]').forEach((form) => {
    const input = form.querySelector('input');
    const next = form.nextElementSibling;
    const fallback = next && next.classList.contains('wa-fallback') ? next : null;
    input.addEventListener('input', () => form.classList.remove('is-error'));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = input.value.trim();
      if (!name) { form.classList.add('is-error'); input.placeholder = 'Écris ton prénom pour continuer'; input.focus(); return; }
      const msg = `Bonjour DH ACADEMY, je m'appelle ${name}. Je souhaite recevoir le lien d'accès à la formation.`;
      const url = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
      const win = window.open(url, '_blank', 'noopener');
      if (fallback) { fallback.href = url; if (!win) fallback.hidden = false; }
    });
  });

  /* ---------- Mobile menu ---------- */
  const burger = $('.nav__burger');
  const menu = $('#menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    if (open && window.gsap && !reduced) {
      gsap.fromTo('#menu nav a', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05, ease: 'power3.out' });
      gsap.fromTo('#menu .btn', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay: 0.3 });
    }
  }
  burger.addEventListener('click', () => setMenu(menu.hidden));

  /* ---------- FAQ: one open at a time ---------- */
  $$('.faq__item').forEach((d) => {
    d.addEventListener('toggle', () => {
      if (!d.open) return;
      $$('.faq__item[open]').forEach((o) => { if (o !== d) o.open = false; });
      if (window.gsap && !reduced) gsap.from(d.querySelector('.faq__a'), { height: 0, autoAlpha: 0, duration: 0.5, ease: 'power3.out', clearProps: 'all' });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ---------- Nav state ---------- */
  const nav = $('#nav');
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-solid', y > 40);
    if (menu.hidden && y > 600 && y > lastY + 2) nav.classList.add('is-away');
    if (y < lastY - 2 || y <= 600) nav.classList.remove('is-away');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!window.gsap || !window.ScrollTrigger || !window.SplitText) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ---------- Smooth scroll (not inside frames, not with reduced motion) ---------- */
  const framed = window.self !== window.top;
  if (!reduced && !framed && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 && $(id);
      if (!target) return;
      e.preventDefault();
      if (!menu.hidden) setMenu(false);
      const offset = id === '#rejoindre' ? -140 : -72;
      if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 });
      else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  // Active nav link
  const links = $$('.nav__links a');
  ['a-propos', 'services', 'realisations', 'methode', 'contact'].forEach((id) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (s) => { if (s.isActive) links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id)); },
      onLeaveBack: () => { if (id === 'a-propos') links.forEach((a) => a.classList.remove('is-active')); },
    });
  });

  if (reduced) return;

  /* =========================================================
     HERO — « l'heure bleue » : le paysage s'éclaire, le texte se pose
     ========================================================= */
  const titleSplit = SplitText.create('[data-hero-title]', { type: 'lines', mask: 'lines', linesClass: 'split-line' });

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, paused: true });
  intro
    .fromTo('.hero__photo', { scale: 1.14, filter: 'brightness(.25) blur(6px)' }, { scale: 1.02, filter: 'brightness(1) blur(0px)', duration: 2.8, ease: 'power2.out' }, 0)
    .from('.nav__inner', { y: -16, autoAlpha: 0, duration: 1.2 }, 0.6)
    .from('.hero__kicker', { y: 16, autoAlpha: 0, duration: 1 }, 0.7)
    .from(titleSplit.lines, { yPercent: 105, duration: 1.3, ease: 'expo.out', stagger: 0.12 }, 0.85)
    .from('.hero .hero__sub', { y: 20, autoAlpha: 0, duration: 1.1 }, 1.35)
    .from('.hero .capture', { y: 20, autoAlpha: 0, duration: 1.1 }, 1.5)
    .from('.hero__fine', { autoAlpha: 0, duration: 1 }, 1.75)
    .set('.hero__photo', { clearProps: 'filter' });

  let started = false;
  const play = () => { if (!started) { started = true; intro.play(); } };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(play);
  setTimeout(play, 1200);

  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero__photo img', { yPercent: 12, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__inner', { y: -80, opacity: 0, ease: 'none', scrollTrigger: { ...heroST, end: '75% top' } });

  /* =========================================================
     Reveals
     ========================================================= */
  $$('[data-reveal-lines]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 105, duration: 1.2, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }),
    });
  });

  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, { y: 24, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  $$('[data-stagger]').forEach((wrap) => {
    gsap.from(wrap.children, {
      y: 40, autoAlpha: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: wrap, start: 'top 88%', once: true },
    });
  });

  // Photos: unveil from the bottom, then drift slowly
  $$('[data-photo]').forEach((ph) => {
    gsap.fromTo(ph, { clipPath: 'inset(100% 0% 0% 0% round 12px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 1.6, ease: 'expo.inOut',
      scrollTrigger: { trigger: ph, start: 'top 85%', once: true },
    });
    const img = ph.querySelector('img');
    if (img) gsap.fromTo(img, { yPercent: -6, scale: 1.1 }, { yPercent: 6, scale: 1, ease: 'none', scrollTrigger: { trigger: ph, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Conviction: words light up as you read
  SplitText.create('[data-quote]', {
    type: 'words', wordsClass: 'w', autoSplit: true,
    onSplit: (self) => gsap.to(self.words, {
      color: '#ededf3', ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: '.quote', start: 'top 80%', end: 'bottom 55%', scrub: 0.6 },
    }),
  });

  // Value counter
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count;
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 2.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true, onEnter: () => (el.textContent = '0') },
      onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString('fr-FR').replace(/\s/g, ' ')),
    });
  });

  // Method: hairlines draw in, steps settle
  $$('.step').forEach((step) => {
    gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 85%', once: true } })
      .fromTo(step, { '--line': 0 }, { '--line': 1, duration: 1.2, ease: 'expo.inOut' })
      .from(step.children, { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.2);
  });

  // Real videos (when added) play only while on screen
  $$('.work video').forEach((v) => {
    ScrollTrigger.create({ trigger: v, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? v.play().catch(() => {}) : v.pause()) });
  });

  gsap.fromTo('.cta__photo img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
