// DH Academy — défilement doux, films au scroll, apparitions
const CFG = window.DH || {}
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
gsap.registerPlugin(ScrollTrigger)

// ── Liens : paiement, WhatsApp, sites en ligne ─────────────
const wa = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent('Bonjour, je suis intéressé(e) par la Méthode 4K de DH Academy.')}`
document.querySelectorAll('.js-wa').forEach((a) => (a.href = wa))
document.querySelectorAll('.js-checkout').forEach((a) => {
  // tant qu'aucun lien de paiement n'est renseigné, le bouton ouvre WhatsApp
  if (a.closest('.nav')) return
  a.href = CFG.checkoutUrl || wa
  a.target = '_blank'
  a.rel = 'noopener'
})
document.querySelectorAll('.js-link').forEach((a) => {
  const url = CFG.links?.[a.dataset.link]
  if (url) {
    a.href = url
    a.hidden = false
  }
})
if (CFG.price) {
  const p = document.querySelector('.js-price')
  p.textContent = CFG.price
  p.hidden = false
}
document.querySelector('.js-year').textContent = new Date().getFullYear()

// ── Défilement doux ────────────────────────────────────────
let lenis
if (!reduce) {
  lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')
      if (id.length < 2) return
      const el = document.querySelector(id)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el, { offset: 0, duration: 1.6 })
      }
    }),
  )
}

// Barre de progression
gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } })

// ── Hero ───────────────────────────────────────────────────
if (!reduce) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('.hero-title .line span', { yPercent: 110, duration: 1.4, stagger: 0.12 })
    .from('.kicker, .hero-lede, .hero-ctas', { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, '-=1')
    .from('.screen', { y: 120, opacity: 0, rotate: 0, duration: 1.6, stagger: 0.12 }, '-=1.2')
  // les écrans montent à des vitesses différentes au défilement
  ;[
    ['.s1', -160],
    ['.s2', -260],
    ['.s3', -90],
  ].forEach(([sel, y]) => gsap.to(sel, { y, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }))
  gsap.to('.hero-content', { y: -120, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } })
}

// ── Manifeste : les mots s'allument ───────────────────────
const mf = document.querySelector('.reveal-words')
mf.innerHTML = mf.textContent
  .trim()
  .split(/\s+/)
  .map((w) => `<span class="w">${w}</span>`)
  .join(' ')
gsap.to('.reveal-words .w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 60%', scrub: true } })

// ── Titres et blocs qui apparaissent ───────────────────────
gsap.utils.toArray('.section-head, .skill-grid article, .modules li, .build-grid article, .faq-list details, .offer-card, .method-inner > *').forEach((el) => {
  gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
})

// ── Films au scroll (canvas épinglé) ───────────────────────
function film(section) {
  const canvas = section.querySelector('canvas')
  const ctx = canvas.getContext('2d')
  const count = +section.dataset.count
  const path = section.dataset.path
  const frames = new Array(count)
  const steps = section.querySelectorAll('.film-steps span')
  let current = 0

  const draw = (i) => {
    // image chargée la plus proche, pour ne jamais afficher d'écran noir
    let img = frames[i]
    for (let d = 1; !img?.complete && d < count; d++) img = frames[i - d] || frames[i + d]
    if (!img?.complete || !img.naturalWidth) return
    const w = canvas.width
    const h = canvas.height
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight)
    const iw = img.naturalWidth * s
    const ih = img.naturalHeight * s
    ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih)
  }
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = canvas.clientWidth * dpr
    canvas.height = canvas.clientHeight * dpr
    draw(current)
  }
  const load = (i) => {
    if (frames[i]) return
    const img = new Image()
    img.decoding = 'async'
    img.src = `${path}${String(i).padStart(3, '0')}.webp`
    img.onload = () => i === current && draw(i)
    frames[i] = img
  }
  // première image tout de suite, le reste à l'approche
  load(0)
  ScrollTrigger.create({
    trigger: section,
    start: 'top 250%',
    once: true,
    onEnter: () => {
      for (let i = 0; i < count; i++) setTimeout(() => load(i), i * 12)
    },
  })
  window.addEventListener('resize', resize)
  resize()

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${(window.innerHeight * +section.dataset.units) / 100}`,
    pin: true,
    scrub: true,
    onUpdate: (st) => {
      const i = Math.min(count - 1, Math.round(st.progress * (count - 1)))
      if (i !== current) {
        current = i
        draw(i)
      }
      steps.forEach((s, k) => s.classList.toggle('on', Math.floor(st.progress * steps.length * 0.999) === k))
    },
  })
  gsap.from(section.querySelector('.film-info'), { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 60%' } })
}
document.querySelectorAll('.film').forEach(film)

// ── DH Studio : les écrans défilent dans l'ordinateur ──────
const show = document.querySelector('.showcase')
const shots = show.querySelectorAll('.device-screen img')
const stl = gsap.timeline({
  scrollTrigger: { trigger: show, start: 'top top', end: () => `+=${(window.innerHeight * +show.dataset.units) / 100}`, pin: true, scrub: true },
})
stl.from('.device', { y: 120, rotateX: 18, scale: 0.9, transformPerspective: 1200, ease: 'power2.out', duration: 1 })
shots.forEach((img, i) => {
  if (i === 0) return
  stl.to(img, { opacity: 1, duration: 0.6 }, `+=0.4`)
})
gsap.from('.showcase-info > *', { x: -40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: show, start: 'top 60%' } })

// ── Méthode 4K : le grand « 4K » glisse ───────────────────
gsap.fromTo('.method-bg', { xPercent: 15 }, { xPercent: -15, ease: 'none', scrollTrigger: { trigger: '.method', start: 'top bottom', end: 'bottom top', scrub: true } })
gsap.from('.method-stats b', {
  textContent: 0,
  duration: 1.6,
  ease: 'power2.out',
  snap: { textContent: 1 },
  stagger: 0.2,
  scrollTrigger: { trigger: '.method-stats', start: 'top 85%' },
})

// ── Pied de page : la marque glisse ───────────────────────
gsap.fromTo('.footer-brand', { xPercent: 8 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } })

window.addEventListener('load', () => ScrollTrigger.refresh())
