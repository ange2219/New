/* =========================================================
   DH ACADEMY — animations (GSAP + ScrollTrigger + SplitText + Lenis)
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  $('#year').textContent = new Date().getFullYear();

  // ---------- Graceful fallback (GSAP failed to load) ----------
  if (!window.gsap || !window.ScrollTrigger) {
    document.body.classList.remove('is-loading');
    const l = $('.loader'); if (l) l.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'power3.out' });

  // ---------- Smooth scroll ----------
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  const navH = () => $('.nav').offsetHeight;
  function scrollToTarget(target) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: el.id === 'accueil' ? -200 : -navH() + 1, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  // anchor links
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      scrollToTarget(target);
    });
  });

  // ---------- Reduced motion: show everything, wire basic UI, stop ----------
  if (reduced) {
    document.body.classList.remove('is-loading');
    $('.loader')?.remove();
    initUI();
    $$('[data-count]').forEach((el) => (el.textContent = format(+el.dataset.count, el.dataset.format)));
    $('[data-value]').textContent = format(4000, 'space');
    gsap.set('.float-wa', { opacity: 1, y: 0 });
    $('.float-wa').classList.add('is-visible');
    $$('.ai-steps li').forEach((li) => li.classList.add('is-done'));
    const t = $('.ai-typed'); t.textContent = t.dataset.text;
    return;
  }

  /* =========================================================
     1. Initial states (set by JS so no-JS users see content)
     ========================================================= */
  gsap.set('.hero__eyebrow, .hero__sub, .hero__ctas, .hero__meta, .hero__scroll', { autoAlpha: 0, y: 24 });
  gsap.set('.chip, .cursor-mark', { autoAlpha: 0, scale: 0.85, y: 20 });
  gsap.set('.hero__grid', { autoAlpha: 0, scale: 1.08 });
  gsap.set('.hero__glow', { autoAlpha: 0 });
  gsap.set('.announce, .nav', { yPercent: -100, autoAlpha: 0 });
  gsap.set('.gen', { autoAlpha: 0, y: 14 });
  gsap.set('.note', { autoAlpha: 0, scale: 0.8 });
  gsap.set('.canvas__sel', { autoAlpha: 0 });

  // Hero title split (lines masked, words rise)
  const heroSplit = SplitText.create('.hero__title', {
    type: 'lines,words', mask: 'lines', linesClass: 'split-line', wordsClass: 'split-word',
  });
  gsap.set(heroSplit.words, { yPercent: 115, rotate: 4, transformOrigin: '0% 100%' });

  /* =========================================================
     2. Preloader → Hero intro
     ========================================================= */
  const counter = { v: 0 };
  const countEl = $('.loader__count');

  const intro = gsap.timeline({ paused: true });
  intro
    .to(counter, {
      v: 100, duration: 1.5, ease: 'power2.inOut',
      onUpdate: () => (countEl.textContent = String(Math.round(counter.v)).padStart(3, '0')),
    }, 0)
    .to('.loader__bar i', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
    .from('.loader__mark span', { yPercent: 110, duration: 0.8, ease: 'power4.out' }, 0.1)
    .to('.loader__inner', { y: -20, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 1.55)
    .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, 1.85)
    .add(() => { document.body.classList.remove('is-loading'); lenis && lenis.start(); }, 2.2)
    .add(() => { $('.loader')?.remove(); ScrollTrigger.refresh(); }, 2.9)
    // Hero
    .to('.hero__grid', { autoAlpha: 1, scale: 1, duration: 1.8, ease: 'expo.out' }, 2.15)
    .to('.hero__glow', { autoAlpha: 1, duration: 2 }, 2.2)
    .to('.announce, .nav', { yPercent: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.08 }, 2.3)
    .to('.hero__eyebrow', { autoAlpha: 1, y: 0, duration: 0.9 }, 2.35)
    .to(heroSplit.words, { yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: 0.045 }, 2.4)
    .to('.hero__sub', { autoAlpha: 1, y: 0, duration: 1 }, 2.95)
    .to('.hero__ctas', { autoAlpha: 1, y: 0, duration: 1 }, 3.05)
    .to('.hero__meta', { autoAlpha: 1, y: 0, duration: 1 }, 3.15)
    .to('.chip, .cursor-mark', { autoAlpha: 1, scale: 1, y: 0, duration: 1.1, ease: 'back.out(1.6)', stagger: 0.09 }, 3.0)
    .to('.hero__scroll', { autoAlpha: 1, y: 0, duration: 0.8 }, 3.4);

  // Blue highlight underline drawn after words land
  const hl = $('.hero__title .hl');
  if (hl) {
    hl.style.backgroundImage = 'linear-gradient(var(--blue), var(--blue))';
    hl.style.backgroundRepeat = 'no-repeat';
    hl.style.backgroundPosition = '0 92%';
    hl.style.backgroundSize = '0% 4px';
    intro.to(hl, { backgroundSize: '100% 4px', duration: 1, ease: 'expo.inOut' }, 3.2);
  }

  const startIntro = () => intro.play();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())
    .then(startIntro);
  // safety: never stay stuck on the loader
  setTimeout(() => { if (!intro.isActive() && intro.progress() === 0) startIntro(); }, 2500);

  /* =========================================================
     3. Global UI
     ========================================================= */
  initUI();

  // Scroll progress
  gsap.to('.scroll-progress i', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
  });

  // Nav: border + hide on scroll down
  const nav = $('.nav');
  ScrollTrigger.create({
    start: 'top -10',
    end: 'max',
    onUpdate: (self) => {
      nav.classList.toggle('is-scrolled', self.scroll() > 10);
      if (document.body.classList.contains('menu-open')) return;
      if (self.scroll() > 600) nav.classList.toggle('is-hidden', self.direction === 1);
      else nav.classList.remove('is-hidden');
    },
  });

  // Active link
  $$('main section[id]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 45%', end: 'bottom 45%',
      onToggle: (self) => {
        if (!self.isActive) return;
        let id = sec.id === 'pour-qui' ? 'methode' : sec.id;
        $$('.nav__links a').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
      },
    });
  });

  // Floating WhatsApp: visible after hero, hidden over contact
  const fw = $('.float-wa');
  const showFw = (v) => {
    fw.classList.toggle('is-visible', v);
    gsap.to(fw, { autoAlpha: v ? 1 : 0, y: v ? 0 : 24, duration: 0.6, ease: 'expo.out', overwrite: true });
  };
  ScrollTrigger.create({
    trigger: '.studio', start: 'top 40%', endTrigger: '#contact', end: 'top 80%',
    onToggle: (self) => showFw(self.isActive),
  });

  /* =========================================================
     4. Hero scroll + mouse parallax
     ========================================================= */
  gsap.to('.hero__content', {
    yPercent: -18, autoAlpha: 0.15, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero__grid', {
    scale: 1.15, yPercent: 10, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  $$('.hero__float [data-depth]').forEach((el) => {
    const d = parseFloat(el.dataset.depth);
    gsap.to(el, {
      yPercent: -450 * d, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  if (finePointer) {
    const floats = $$('.hero__float [data-depth]').map((el) => ({
      el, d: parseFloat(el.dataset.depth),
      x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
    }));
    const glowX = gsap.quickTo('.hero__glow', 'x', { duration: 2, ease: 'power3.out' });
    const glowY = gsap.quickTo('.hero__glow', 'y', { duration: 2, ease: 'power3.out' });
    const heroEl = $('.hero');
    heroEl.addEventListener('pointermove', (e) => {
      const r = heroEl.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      floats.forEach((f) => f.x(nx * 60 * f.d));
      glowX(nx * 160); glowY(ny * 120);
    });
  }

  /* =========================================================
     5. Studio — browser tilts flat, then pinned "AI build" sequence
     ========================================================= */
  const browser = $('#studioBrowser');
  gsap.set(browser, { rotateX: 24, scale: 0.86, y: 60, transformPerspective: 1600 });
  gsap.to(browser, {
    rotateX: 0, scale: 1, y: 0, ease: 'none',
    scrollTrigger: { trigger: '.studio', start: 'top 95%', end: 'top 12%', scrub: 0.6 },
  });

  const typed = $('.ai-typed');
  const fullText = typed.dataset.text;
  const typing = { p: 0 };
  const steps = $$('.ai-steps li');

  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 901px)', mobile: '(max-width: 900px)' }, (ctx) => {
    const { desktop } = ctx.conditions;
    const build = gsap.timeline({
      scrollTrigger: {
        trigger: '.studio',
        start: desktop ? 'top 12%' : 'center center',
        end: desktop ? '+=1100' : '+=800',
        pin: true, scrub: 0.8, anticipatePin: 1,
      },
    });
    const selLabel = $('.canvas__sel span');
    build.eventCallback('onUpdate', () => {
      const t = build.time();
      steps.forEach((li, i) => li.classList.toggle('is-done', t >= 2.2 + i * 0.6));
      selLabel.textContent = t >= 4.1 ? 'Section · Cartes' : 'Section · Hero';
    });
    build
      .to(typing, {
        p: 1, duration: 2, ease: 'none',
        onUpdate: () => (typed.textContent = fullText.slice(0, Math.round(fullText.length * typing.p))),
      }, 0)
      .to('.site__nav', { autoAlpha: 1, y: 0, duration: 0.5 }, 2.2)
      .to('.site__hero-txt .gen', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.18 }, 2.6)
      .to('.site__visual', { autoAlpha: 1, y: 0, duration: 0.6 }, 3)
      .from('.shape', { scale: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(2)' }, 3.1)
      .to('.canvas__sel', { autoAlpha: 1, duration: 0.3 }, 3.3)
      .to('.site__card', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.15 }, 3.7)
      .to('.canvas__sel', { top: desktop ? '62%' : '64%', height: desktop ? '27%' : '24%', duration: 0.6, ease: 'power2.inOut' }, 4.1)
      .to('.note--1', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 1.0)
      .to('.note--2', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 2.8)
      .to('.note--3', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 4.3)
      .to({}, { duration: 0.6 }, 4.7);
  });

  /* =========================================================
     6. Marquee with scroll-velocity boost
     ========================================================= */
  const marquee = gsap.to('.marquee__track', { xPercent: -50, ease: 'none', duration: 32, repeat: -1 });
  ScrollTrigger.create({
    trigger: '.strip', start: 'top bottom', end: 'bottom top',
    onUpdate: (self) => {
      const v = Math.min(Math.abs(self.getVelocity()) / 400, 5);
      gsap.to(marquee, { timeScale: 1 + v, duration: 0.2, overwrite: true, onComplete: () => gsap.to(marquee, { timeScale: 1, duration: 1.2 }) });
    },
  });
  gsap.from('.strip__label', { autoAlpha: 0, y: 20, duration: 1, scrollTrigger: { trigger: '.strip', start: 'top 85%' } });

  /* =========================================================
     7. Manifesto — words ink in with scroll
     ========================================================= */
  SplitText.create('.manifesto__text', {
    type: 'words', wordsClass: 'w', autoSplit: true,
    onSplit(self) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 60%', scrub: 0.5 },
      });
      self.words.forEach((w, i) => {
        const isEm = !!w.closest('em');
        tl.to(w, { color: isEm ? '#146ef5' : '#080808', duration: 0.3, ease: 'none' }, i * 0.1);
      });
      return tl;
    },
  });

  /* =========================================================
     8. Headings + generic reveals
     ========================================================= */
  $$('[data-split]').forEach((el) => {
    if (el.classList.contains('hero__title')) return;
    SplitText.create(el, {
      type: 'lines,words', mask: 'lines', linesClass: 'split-line', wordsClass: 'split-word', autoSplit: true,
      onSplit(self) {
        return gsap.from(self.words, {
          yPercent: 110, rotate: 3, transformOrigin: '0% 100%', duration: 1.1, ease: 'expo.out', stagger: 0.04,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      },
    });
  });

  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
  });
  gsap.set('.reveal', { autoAlpha: 0 });

  /* =========================================================
     9. About — stacked browsers parallax + counters
     ========================================================= */
  const stackTl = gsap.timeline({ scrollTrigger: { trigger: '.stack', start: 'top 85%', toggleActions: 'play none none reverse' } });
  stackTl.from('.stack__card', { y: 80, autoAlpha: 0, rotate: (i) => [6, -4, 3][i], duration: 1.2, stagger: 0.12, ease: 'expo.out' });
  [['.stack__card--back', -60], ['.stack__card--mid', -20], ['.stack__card--front', 30]].forEach(([s, y]) => {
    gsap.to(s, { y, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from('.stat', {
    autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: '.stats', start: 'top 88%' },
  });
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count;
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => (el.textContent = format(Math.round(o.v), el.dataset.format)),
    });
  });

  /* =========================================================
     10. Services — horizontal pinned scroll
     ========================================================= */
  const track = $('.services__track');
  const pinWrap = $('.services__pin');
  const cards = $$('.svc:not(.svc--end)');
  const idxEl = $('.services__idx');
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

  const hScroll = gsap.to(track, {
    x: () => -distance(), ease: 'none',
    scrollTrigger: {
      trigger: '.services', start: 'top top', end: () => '+=' + distance(),
      pin: pinWrap, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: (self) => {
        gsap.set('.services__line i', { scaleX: 0.2 + self.progress * 0.8 });
        const n = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
        idxEl.textContent = String(n).padStart(2, '0');
      },
    },
  });
  // cards: subtle depth while sliding through
  cards.forEach((card) => {
    gsap.fromTo(card.querySelector('.svc__thumb'), { scale: 1.08 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left right', end: 'center center', scrub: true },
    });
    gsap.from(card.querySelector('.meter i'), {
      scaleX: 0, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left 85%' },
    });
  });
  gsap.from('.svc', {
    y: 60, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: '.services', start: 'top 70%' },
  });

  /* =========================================================
     11. Value — monumental counter + bars
     ========================================================= */
  const valEl = $('[data-value]');
  const val = { v: 0 };
  gsap.timeline({ scrollTrigger: { trigger: '.value', start: 'top 70%' } })
    .from('.value__upto', { autoAlpha: 0, y: 20, duration: 0.8 })
    .to(val, {
      v: 4000, duration: 2.2, ease: 'power4.out',
      onUpdate: () => (valEl.textContent = format(Math.round(val.v / 10) * 10, 'space')),
    }, 0.1)
    .from('.value__caption', { autoAlpha: 0, y: 20, duration: 1 }, 0.5);
  gsap.fromTo('.value__digits', { scale: 0.82, letterSpacing: '0em' }, {
    scale: 1, letterSpacing: '-0.06em', ease: 'none',
    scrollTrigger: { trigger: '.value', start: 'top bottom', end: 'center center', scrub: true },
  });
  gsap.from('.vs i', {
    scaleY: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out',
    scrollTrigger: { trigger: '.value__scale', start: 'top 88%' },
  });
  gsap.from('.vs span', {
    autoAlpha: 0, y: 8, duration: 0.6, stagger: 0.1,
    scrollTrigger: { trigger: '.value__scale', start: 'top 88%' },
  });

  /* =========================================================
     12. Method — dark section expands, steps light up
     ========================================================= */
  gsap.fromTo('.method', { clipPath: 'inset(0% 3% 0% 3% round 8px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
    scrollTrigger: { trigger: '.method', start: 'top bottom', end: 'top 20%', scrub: true },
  });
  gsap.from('.method__lead', { autoAlpha: 0, y: 24, duration: 1, scrollTrigger: { trigger: '.method__lead', start: 'top 88%' } });
  gsap.to('.method__rail i', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: '.method__steps', start: 'top 60%', end: 'bottom 60%', scrub: true },
  });
  $$('.step').forEach((step) => {
    ScrollTrigger.create({
      trigger: step, start: 'top 62%', end: 'bottom 62%',
      onToggle: (self) => step.classList.toggle('is-active', self.isActive),
    });
    gsap.from(step.querySelector('h3'), {
      x: 30, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: step, start: 'top 75%' },
    });
  });

  /* =========================================================
     13. Audience cards
     ========================================================= */
  gsap.from('.aud-card', {
    y: 60, autoAlpha: 0, rotateX: -12, transformPerspective: 900, transformOrigin: '50% 100%',
    duration: 1.1, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: '.aud-grid', start: 'top 82%' },
  });

  /* =========================================================
     14. FAQ items
     ========================================================= */
  gsap.from('.acc__item', {
    autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.07, ease: 'expo.out',
    scrollTrigger: { trigger: '.acc', start: 'top 85%' },
  });

  /* =========================================================
     15. CTA
     ========================================================= */
  gsap.timeline({ scrollTrigger: { trigger: '.cta', start: 'top 60%' } })
    .from('.cta__sub', { autoAlpha: 0, y: 24, duration: 1 }, 0.4)
    .from('.cta__actions .btn', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.1 }, 0.5)
    .from('.cta__info > div', { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.08 }, 0.7);
  gsap.fromTo('.cta__word', { yPercent: 40 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.cta__word', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
  gsap.fromTo('.cta__bg', { yPercent: -10 }, {
    yPercent: 10, ease: 'none',
    scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* =========================================================
     Helpers + UI wiring (also used with reduced motion)
     ========================================================= */
  function format(n, mode) {
    if (mode === 'space') return n.toLocaleString('fr-FR').replace(/\s/g, ' ');
    return String(n);
  }

  function closeMenu() {
    if (!document.body.classList.contains('menu-open')) return;
    toggleMenu(false);
  }

  function toggleMenu(open) {
    const menu = $('.mobile-menu');
    const burger = $('.nav__burger');
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      lenis && lenis.stop();
      gsap.set(menu, { visibility: 'visible' });
      gsap.to(menu, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' });
      gsap.fromTo('.mobile-menu nav a', { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05, delay: 0.25, ease: 'expo.out' });
      gsap.fromTo('.mobile-menu .btn', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'expo.out' });
    } else {
      lenis && lenis.start();
      gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
    }
  }

  function initUI() {
    // Announcement close
    $('.announce__close').addEventListener('click', () => {
      const a = $('.announce');
      if (!window.gsap) { a.remove(); return; }
      gsap.to(a, { height: 0, autoAlpha: 0, duration: 0.5, ease: 'expo.inOut', onComplete: () => { a.remove(); ScrollTrigger.refresh(); } });
    });

    // Mobile menu
    $('.nav__burger').addEventListener('click', () => toggleMenu(!document.body.classList.contains('menu-open')));

    // Accordion
    $$('.acc__item').forEach((item) => {
      const q = $('.acc__q', item);
      const a = $('.acc__a', item);
      q.addEventListener('click', () => {
        const open = !item.classList.contains('is-open');
        $$('.acc__item.is-open').forEach((o) => {
          if (o === item) return;
          o.classList.remove('is-open');
          $('.acc__q', o).setAttribute('aria-expanded', 'false');
          gsap.to($('.acc__a', o), { height: 0, duration: 0.5, ease: 'expo.inOut' });
        });
        item.classList.toggle('is-open', open);
        q.setAttribute('aria-expanded', String(open));
        gsap.to(a, {
          height: open ? 'auto' : 0, duration: 0.6, ease: 'expo.inOut',
          onComplete: () => ScrollTrigger.refresh(),
        });
      });
    });

    // Magnetic buttons
    if (finePointer && !reduced) {
      $$('.magnetic').forEach((btn) => {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        btn.addEventListener('pointermove', (e) => {
          const r = btn.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.25);
          yTo((e.clientY - r.top - r.height / 2) * 0.35);
        });
        btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
      });

      // Card tilt on audience cards
      $$('.aud-card, .svc').forEach((card) => {
        const rx = gsap.quickTo(card, 'rotateX', { duration: 0.8, ease: 'power3.out' });
        const ry = gsap.quickTo(card, 'rotateY', { duration: 0.8, ease: 'power3.out' });
        gsap.set(card, { transformPerspective: 1000 });
        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 6);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
        });
        card.addEventListener('pointerleave', () => { rx(0); ry(0); });
      });
    }
  }
})();
