/* =========================================================
   DH ACADEMY v2 — animations (GSAP + ScrollTrigger + SplitText + Lenis)
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const WA = '2290199563785';

  $('#year').textContent = new Date().getFullYear();

  // ---------- WhatsApp capture forms (work even without GSAP) ----------
  $$('[data-wa-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const name = input.value.trim();
      if (!name) {
        form.classList.remove('is-shake'); void form.offsetWidth; form.classList.add('is-shake');
        input.focus();
        return;
      }
      const msg = `Bonjour DH ACADEMY, je m'appelle ${name}. Je souhaite recevoir le lien d'accès à la formation.`;
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  });

  if (!window.gsap || !window.ScrollTrigger) {
    document.body.classList.remove('is-loading');
    $('.loader')?.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'power3.out' });

  // ---------- Smooth scroll ----------
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      if (document.body.classList.contains('menu-open')) toggleMenu(false);
      if (lenis) lenis.scrollTo(target, { offset: id === '#rejoindre' ? -160 : -20, duration: 1.6 });
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  initUI();

  if (reduced) {
    document.body.classList.remove('is-loading');
    $('.loader')?.remove();
    $$('[data-count]').forEach((el) => (el.textContent = format(+el.dataset.count, el.dataset.format)));
    $('[data-value]').textContent = format(4000, 'space');
    $$('.checks li').forEach((li) => li.classList.add('is-done'));
    const bt = $('.brief__text'); bt.textContent = bt.dataset.text;
    return;
  }

  /* =========================================================
     1. Initial states
     ========================================================= */
  gsap.set('.nav__bar', { yPercent: -150, autoAlpha: 0 });
  gsap.set('.hero__tag, .hero__sub, .hero__form, .hero__note, .hero__bottom', { autoAlpha: 0, y: 24 });
  gsap.set('.hero__img', { scale: 1.35 });
  gsap.set('.gen', { autoAlpha: 0, y: 14 });
  gsap.set('.snote', { autoAlpha: 0, scale: 0.85 });
  gsap.set('.app__sel', { autoAlpha: 0 });
  gsap.set('.float-wa', { autoAlpha: 0, y: 20 });

  const heroSplit = SplitText.create('[data-hero-title]', {
    type: 'lines,words', mask: 'lines', linesClass: 'split-line', wordsClass: 'split-word',
  });
  gsap.set(heroSplit.words, { yPercent: 120 });

  // Ring: prepare stroke drawing
  const rings = $$('.loader__ring circle');
  rings.forEach((c) => {
    const len = c.getTotalLength();
    gsap.set(c, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap.set('.loader__word span', { yPercent: 110 });

  /* =========================================================
     2. Intro: ring draws → opens like an aperture onto the landscape
     ========================================================= */
  const media = $('.hero__media');
  const coverRadius = () => Math.hypot(window.innerWidth, window.innerHeight) / 2 + 40;
  gsap.set(media, { clipPath: 'circle(0px at 50% 50%)' });

  const num = $('.loader__num');
  const count = { v: 0 };
  const intro = gsap.timeline({ paused: true });
  intro
    .to(rings, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.12 }, 0)
    .to('.loader__word span', { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.035 }, 0.2)
    .to(count, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => (num.textContent = Math.round(count.v)) }, 0)
    .to('.loader__word, .loader__count', { autoAlpha: 0, y: -10, duration: 0.45, ease: 'power2.in' }, 1.65)
    // the landscape appears inside the inner ring
    .to(media, { clipPath: 'circle(52px at 50% 50%)', duration: 0.7, ease: 'power3.inOut' }, 1.75)
    .set('.loader', { backgroundColor: 'transparent' }, 1.75)
    .to('.loader__ring', { scale: 1.15, duration: 0.7, ease: 'power3.inOut' }, 1.75)
    // aperture opens
    .set(rings, { strokeDasharray: 'none' }, 2.4)
    .to(rings, { attr: { r: (i) => coverRadius() / 1.15 + (2 - i) * 60 }, duration: 1.5, ease: 'expo.inOut' }, 2.4)
    .to('.loader__ring', { autoAlpha: 0, duration: 0.7, ease: 'power2.in' }, 3.1)
    .to(media, { clipPath: () => `circle(${coverRadius()}px at 50% 50%)`, duration: 1.5, ease: 'expo.inOut' }, 2.4)
    .to('.hero__img', { scale: 1.06, duration: 2.6, ease: 'expo.out' }, 2.4)
    .add(() => { document.body.classList.remove('is-loading'); lenis && lenis.start(); }, 3.0)
    .add(() => { $('.loader')?.remove(); gsap.set(media, { clearProps: 'clipPath' }); ScrollTrigger.refresh(); }, 3.95)
    // hero content
    .to('.nav__bar', { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out' }, 3.1)
    .to('.hero__tag', { autoAlpha: 1, y: 0, duration: 1 }, 3.05)
    .to(heroSplit.words, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.05 }, 3.1)
    .to('.hero__sub', { autoAlpha: 1, y: 0, duration: 1.1 }, 3.6)
    .to('.hero__form', { autoAlpha: 1, y: 0, duration: 1.1 }, 3.72)
    .to('.hero__note', { autoAlpha: 1, y: 0, duration: 1 }, 3.85)
    .to('.hero__bottom', { autoAlpha: 1, y: 0, duration: 1 }, 4.0);

  const start = () => intro.play();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start);
  setTimeout(() => { if (intro.progress() === 0) start(); }, 2500);

  /* =========================================================
     3. Global
     ========================================================= */
  const nav = $('.nav');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 40);
      if (document.body.classList.contains('menu-open')) return;
      nav.classList.toggle('is-hidden', y > 900 && self.direction === 1);
    },
  });

  const links = $$('.nav__links a');
  $$('main section[id]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 45%', end: 'bottom 45%',
      onToggle: (self) => {
        if (!self.isActive) return;
        const id = sec.id === 'pour-qui' ? 'methode' : sec.id;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
      },
    });
  });

  ScrollTrigger.create({
    trigger: '.studio', start: 'top 60%', endTrigger: '.contact', end: 'top 70%',
    onToggle: (self) => gsap.to('.float-wa', { autoAlpha: self.isActive ? 1 : 0, y: self.isActive ? 0 : 20, duration: 0.6, ease: 'expo.out', overwrite: true }),
  });

  /* =========================================================
     4. Hero — scroll depth + pointer parallax + drifting fog
     ========================================================= */
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero__img', { yPercent: 14, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__content', { y: -120, autoAlpha: 0, ease: 'none', scrollTrigger: { ...heroST, end: '80% top' } });
  gsap.to('.hero__fog--1', { yPercent: -60, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__fog--2', { yPercent: -110, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__overlay', { backgroundColor: 'rgba(23,23,33,.6)', ease: 'none', scrollTrigger: heroST });

  gsap.to('.hero__fog--1', { xPercent: 8, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.hero__fog--2', { xPercent: -10, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  if (finePointer) {
    const hx = gsap.quickTo('.hero__media', 'x', { duration: 1.8, ease: 'power3.out' });
    const hy = gsap.quickTo('.hero__media', 'y', { duration: 1.8, ease: 'power3.out' });
    $('.hero').addEventListener('pointermove', (e) => {
      hx((e.clientX / window.innerWidth - 0.5) * -24);
      hy((e.clientY / window.innerHeight - 0.5) * -16);
    });
  }

  /* =========================================================
     5. Studio — app tilts flat, then pinned "live build"
     ========================================================= */
  const app = $('#app');
  gsap.set(app, { rotateX: 22, scale: 0.88, y: 80, transformPerspective: 1800 });
  gsap.to(app, {
    rotateX: 0, scale: 1, y: 0, ease: 'none',
    scrollTrigger: { trigger: '.studio__stage', start: 'top 100%', end: 'top 18%', scrub: 0.6 },
  });

  const brief = $('.brief__text');
  const fullText = brief.dataset.text;
  const checks = $$('.checks li');
  const selLabel = $('.app__sel span');
  const typing = { p: 0 };

  gsap.matchMedia().add({ desktop: '(min-width: 901px)', mobile: '(max-width: 900px)' }, (ctx) => {
    const { desktop } = ctx.conditions;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.studio__stage', start: desktop ? 'top 18%' : 'center 55%',
        end: desktop ? '+=1200' : '+=900', pin: true, scrub: 0.8, anticipatePin: 1,
      },
      onUpdate() {
        const t = this.time();
        checks.forEach((li, i) => li.classList.toggle('is-done', t >= 2.2 + i * 0.6));
        selLabel.textContent = t >= 4.1 ? 'Section · Cartes' : 'Section · Hero';
      },
    });
    tl.to(typing, { p: 1, duration: 2, ease: 'none', onUpdate: () => (brief.textContent = fullText.slice(0, Math.round(fullText.length * typing.p))) }, 0)
      .to('.snote--1', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.8)
      .to('.gsite', { backgroundColor: '#f4f4f7', outlineColor: 'rgba(237,237,243,0)', duration: 0.5, ease: 'none' }, 2.0)
      .to('.gsite__nav', { autoAlpha: 1, y: 0, duration: 0.5 }, 2.2)
      .to('.gsite__hero', { autoAlpha: 1, y: 0, duration: 0.6 }, 2.5)
      .fromTo('.gsite__img img', { scale: 1.3 }, { scale: 1, duration: 1.2, ease: 'power2.out' }, 2.5)
      .to('.gsite__copy .gen', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 }, 2.9)
      .to('.snote--2', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 2.8)
      .to('.app__sel', { autoAlpha: 1, duration: 0.3 }, 3.4)
      .to('.gsite__row .gen', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.15 }, 3.7)
      .to('.app__sel', { top: desktop ? '74%' : '72%', height: desktop ? '20%' : '20%', duration: 0.6, ease: 'power2.inOut' }, 4.1)
      .to('.snote--3', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 4.4)
      .to({}, { duration: 0.6 }, 4.8);
  });

  /* =========================================================
     6. Split headings + reveals
     ========================================================= */
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines,words', mask: 'lines', linesClass: 'split-line', wordsClass: 'split-word', autoSplit: true,
      onSplit(self) {
        return gsap.from(self.words, {
          yPercent: 120, duration: 1.2, ease: 'expo.out', stagger: 0.04,
          scrollTrigger: { trigger: el, start: 'top 86%' },
        });
      },
    });
  });
  gsap.set('.reveal', { autoAlpha: 0, y: 28 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 90%',
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
  });

  /* =========================================================
     7. Manifesto — words light up with scroll
     ========================================================= */
  SplitText.create('.manifesto__text', {
    type: 'words', wordsClass: 'w', autoSplit: true,
    onSplit(self) {
      return gsap.to(self.words, {
        color: '#ededf3', ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: '.manifesto', start: 'top 72%', end: 'bottom 62%', scrub: 0.5 },
      });
    },
  });

  /* =========================================================
     8. About — image reveal + parallax, counters
     ========================================================= */
  gsap.timeline({ scrollTrigger: { trigger: '.about__figure', start: 'top 82%' } })
    .fromTo('.about__img', { clipPath: 'inset(100% 0% 0% 0% round 12px)' }, { clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 1.6, ease: 'expo.inOut' })
    .from('.about__img img', { scale: 1.4, duration: 2, ease: 'expo.out' }, 0.2)
    .from('.about__cap', { autoAlpha: 0, y: 16, duration: 0.8 }, 1.1);
  gsap.to('.about__img img', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.about__figure', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.stat', { autoAlpha: 0, y: 40, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 88%' } });
  $$('[data-count]').forEach((el) => {
    const o = { v: 0 };
    gsap.to(o, {
      v: +el.dataset.count, duration: 2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%' },
      onUpdate: () => (el.textContent = format(Math.round(o.v), el.dataset.format)),
    });
  });

  /* =========================================================
     9. Ambition — framed image expands to full-bleed
     ========================================================= */
  const ambSplit = SplitText.create('[data-ambition]', { type: 'lines,words', mask: 'lines', linesClass: 'split-line', wordsClass: 'split-word' });
  gsap.set(ambSplit.words, { yPercent: 120 });
  gsap.set('.ambition__copy .eyebrow, .ambition__sub', { autoAlpha: 0, y: 20 });
  gsap.timeline({
    scrollTrigger: { trigger: '.ambition', start: 'top top', end: '+=140%', pin: '.ambition__pin', scrub: 0.8, anticipatePin: 1 },
  })
    .to('.ambition__frame', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 }, 0)
    .to('.ambition__frame img', { scale: 1, ease: 'none', duration: 1.2 }, 0)
    .to('.ambition__copy .eyebrow', { autoAlpha: 0.8, y: 0, duration: 0.3 }, 0.55)
    .to(ambSplit.words, { yPercent: 0, duration: 0.5, stagger: 0.03, ease: 'power3.out' }, 0.6)
    .to('.ambition__sub', { autoAlpha: 1, y: 0, duration: 0.35 }, 1.0)
    .to({}, { duration: 0.3 });

  /* =========================================================
     10. Services — horizontal pinned scroll
     ========================================================= */
  const track = $('.services__track');
  const cards = $$('.svc:not(.svc--end)');
  const idx = $('.services__idx');
  const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const hScroll = gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: '.services', start: 'top top', end: () => '+=' + dist(), pin: '.services__pin',
      scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: (self) => {
        gsap.set('.services__line i', { scaleX: 0.2 + self.progress * 0.8 });
        idx.textContent = String(Math.min(cards.length, Math.floor(self.progress * cards.length) + 1)).padStart(2, '0');
      },
    },
  });
  cards.forEach((card) => {
    gsap.to(card.querySelector('.svc__img img'), {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left right', end: 'center center', scrub: true },
    });
    gsap.from(card.querySelector('.meter i'), {
      scaleX: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left 85%' },
    });
  });
  gsap.from('.services__track > *', { y: 80, autoAlpha: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.services', start: 'top 65%' } });

  /* =========================================================
     11. Value
     ========================================================= */
  const valEl = $('[data-value]');
  const val = { v: 0 };
  gsap.timeline({ scrollTrigger: { trigger: '.value', start: 'top 68%' } })
    .from('.value__upto', { autoAlpha: 0, y: 20, duration: 0.8 })
    .to(val, { v: 4000, duration: 2.4, ease: 'power4.out', onUpdate: () => (valEl.textContent = format(Math.round(val.v / 10) * 10, 'space')) }, 0.1)
    .from('.value__caption', { autoAlpha: 0, y: 20, duration: 1 }, 0.6);
  gsap.fromTo('.value__digits', { scale: 0.8, autoAlpha: 0.2 }, { scale: 1, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: '.value', start: 'top bottom', end: 'center 55%', scrub: true } });
  gsap.fromTo('.value__glow', { scale: 0.6, autoAlpha: 0 }, { scale: 1.1, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: '.value', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.bar i', { scaleY: 0, duration: 1.3, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.bars', start: 'top 90%' } });
  gsap.from('.bar span', { autoAlpha: 0, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: '.bars', start: 'top 90%' } });

  /* =========================================================
     12. Method
     ========================================================= */
  gsap.from('.method__aside .lead', { autoAlpha: 0, y: 24, duration: 1, scrollTrigger: { trigger: '.method__aside', start: 'top 75%' } });
  gsap.to('.method__progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 60%', end: 'bottom 60%', scrub: true } });
  $$('.step').forEach((step) => {
    ScrollTrigger.create({ trigger: step, start: 'top 62%', end: 'bottom 62%', onToggle: (s) => step.classList.toggle('is-active', s.isActive) });
    gsap.from(step, { y: 60, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: step, start: 'top 92%' } });
  });

  /* =========================================================
     13. Audience / FAQ / Contact / Footer
     ========================================================= */
  gsap.from('.aud__card', { y: 70, autoAlpha: 0, duration: 1.2, stagger: { each: 0.08, grid: 'auto', from: 'start' }, ease: 'expo.out', scrollTrigger: { trigger: '.aud', start: 'top 85%' } });
  gsap.from('.acc__item', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.acc', start: 'top 88%' } });

  gsap.to('.contact__media img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.timeline({ scrollTrigger: { trigger: '.contact__inner', start: 'top 70%' } })
    .from('.contact__inner .eyebrow', { autoAlpha: 0, y: 16, duration: 0.8 }, 0)
    .from('.contact__sub', { autoAlpha: 0, y: 20, duration: 1 }, 0.4)
    .from('.contact__form', { autoAlpha: 0, y: 20, duration: 1 }, 0.55)
    .from('.contact__call', { autoAlpha: 0, y: 20, duration: 1 }, 0.7);
  gsap.from('.ccard', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.contact__cards', start: 'top 92%' } });
  gsap.fromTo('.footer__word', { yPercent: 60 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer__word', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* =========================================================
     Helpers
     ========================================================= */
  function format(n, mode) {
    return mode === 'space' ? n.toLocaleString('fr-FR').replace(/\s/g, ' ') : String(n);
  }

  function toggleMenu(open) {
    const menu = $('.mmenu');
    const burger = $('.nav__burger');
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      lenis && lenis.stop();
      gsap.set(menu, { visibility: 'visible' });
      gsap.to(menu, { clipPath: 'circle(150% at calc(100% - 46px) 46px)', duration: 0.9, ease: 'expo.inOut' });
      gsap.fromTo('.mmenu nav a', { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.05, delay: 0.3, ease: 'expo.out' });
      gsap.fromTo('.mmenu__foot', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.55, ease: 'expo.out' });
    } else {
      lenis && lenis.start();
      gsap.to(menu, { clipPath: 'circle(0% at calc(100% - 46px) 46px)', duration: 0.7, ease: 'expo.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
    }
  }

  function initUI() {
    $('.nav__burger').addEventListener('click', () => toggleMenu(!document.body.classList.contains('menu-open')));

    $$('.acc__item').forEach((item) => {
      const q = $('.acc__q', item);
      const a = $('.acc__a', item);
      q.addEventListener('click', () => {
        const open = !item.classList.contains('is-open');
        $$('.acc__item.is-open').forEach((o) => {
          if (o === item) return;
          o.classList.remove('is-open');
          $('.acc__q', o).setAttribute('aria-expanded', 'false');
          gsap.to($('.acc__a', o), { height: 0, duration: 0.55, ease: 'expo.inOut' });
        });
        item.classList.toggle('is-open', open);
        q.setAttribute('aria-expanded', String(open));
        gsap.to(a, { height: open ? 'auto' : 0, duration: 0.65, ease: 'expo.inOut', onComplete: () => ScrollTrigger.refresh() });
      });
    });

    if (finePointer && !reduced) {
      $$('.magnetic, .capture__btn').forEach((btn) => {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.45)' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.45)' });
        btn.addEventListener('pointermove', (e) => {
          const r = btn.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.2);
          yTo((e.clientY - r.top - r.height / 2) * 0.3);
        });
        btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
      });
    }
  }
})();
