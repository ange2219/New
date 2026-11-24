// DH Academy — mur de cartes 3D, projets animés, défilement doux
const CFG = window.DH || {}
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
gsap.registerPlugin(ScrollTrigger)

// ── Liens : WhatsApp (et paiement plus tard) ───────────────
const wa = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent('Bonjour, je viens du site DH Academy.')}`
document.querySelectorAll('.js-wa').forEach((a) => (a.href = wa))
document.querySelectorAll('.js-checkout').forEach((a) => {
  a.href = CFG.checkoutUrl || wa // tant que la formation n'est pas ouverte : WhatsApp
  a.target = '_blank'
  a.rel = 'noopener'
})
document.querySelector('.js-year').textContent = new Date().getFullYear()

// ── Défilement doux ────────────────────────────────────────
if (!reduce) {
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')
      if (id.length < 2) return
      e.preventDefault()
      lenis.scrollTo(id, { duration: 1.6 })
    }),
  )
}
const nav = document.querySelector('.nav')
ScrollTrigger.create({ start: 40, onToggle: (s) => nav.classList.toggle('scrolled', s.isActive) })

// ═════ HERO : mur de cartes courbé ═════
const CARDS = [
  ['art-1', 'Scroll', 'Film au<br>scroll'],
  ['art-2', '3D', 'Produit<br>en 3D', 'orb'],
  ['art-9', 'Motion', 'Motion<br>design'],
  ['art-3', '3D', 'Particules', 'orb'],
  ['art-7', 'Design', 'Direction<br>artistique'],
  ['art-5', 'Visuels', 'Visuels<br>IA'],
  ['art-4', 'Commerce', 'E-commerce'],
  ['art-8', 'Scroll', 'Parallaxe', 'orb'],
  ['art-10', 'Premium', 'Sites à<br>4 000 €'],
  ['art-6', '3D', 'WebGL'],
  ['art-1', 'Motion', 'Transitions'],
  ['art-7', 'Design', 'Typo<br>éditoriale'],
  ['art-5', 'Commerce', 'Panier<br>animé', 'bars'],
  ['art-2', 'Web', 'Mobile<br>first'],
  ['art-9', 'Scroll', 'Canvas'],
  ['art-3', 'Visuels', 'Vidéo<br>produit'],
  ['art-8', 'Motion', 'Micro-<br>interactions'],
  ['art-10', 'Premium', 'Sur<br>mesure'],
]
const ring = document.getElementById('ring')
const stage = document.querySelector('.ring-stage')
const N = CARDS.length
let R = 0
function layoutRing() {
  const w = stage.clientWidth
  const ch = stage.clientHeight * 0.78
  const cw = ch * 0.74
  R = Math.max(w * 0.4, ((cw + 14) * N) / (2 * Math.PI))
  ring.innerHTML = CARDS.map(([art, small, title, extra], i) => {
    const a = (360 / N) * i
    const deco = extra === 'orb' ? '<span class="orb"></span>' : extra === 'bars' ? '<span class="bars"><i style="height:40%"></i><i style="height:70%"></i><i style="height:55%"></i><i style="height:90%"></i></span>' : ''
    return `<div class="r-card" style="width:${cw}px;height:${ch}px;margin:${-ch / 2}px 0 0 ${-cw / 2}px;transform:rotateY(${a}deg) translateZ(${-R}px)">
      <div class="art ${art}">${deco}<small>${small}</small><strong>${title}</strong></div></div>`
  }).join('')
}
layoutRing()
window.addEventListener('resize', layoutRing)

const rot = { y: 0, v: reduce ? 0 : 0.06, tilt: 0, z: 0 }
let dragging = false
let lastX = 0
stage.addEventListener('pointerdown', (e) => {
  dragging = true
  lastX = e.clientX
  stage.setPointerCapture(e.pointerId)
})
stage.addEventListener('pointermove', (e) => {
  if (!dragging) return
  rot.y -= (e.clientX - lastX) * 0.15
  lastX = e.clientX
})
stage.addEventListener('pointerup', () => (dragging = false))
gsap.ticker.add(() => {
  if (!dragging) rot.y += rot.v
  ring.style.transform = `translateZ(${R * 0.55 + rot.z}px) rotateX(${rot.tilt}deg) rotateY(${rot.y}deg)`
})
if (!reduce) {
  gsap.to(rot, { tilt: 14, z: -260, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
  gsap.to('.ring-stage', { opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '40% top', end: 'bottom top', scrub: true } })
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('.hero-title .ln > span', { yPercent: 110, duration: 1.4, stagger: 0.1 })
    .from('.hero .eyebrow', { opacity: 0, y: 12, duration: 1 }, 0.1)
    .from('.ring', { opacity: 0, duration: 1.6 }, 0.3)
    .from(rot, { y: -70, duration: 2.6, ease: 'power3.out' }, 0.3)
    .from('.hero-foot > *', { opacity: 0, y: 20, duration: 1, stagger: 0.1 }, 0.8)
}

// ═════ PROJETS : 12 cases, 3 réalisées ═════
// Chaque projet est un enregistrement du site qui défile du haut en bas (130 images).
// Pour ajouter un projet : remplacer une case « À venir » par un objet comme ceux-ci.
const PROJECTS = [
  { name: 'AXE Wild Spice', kind: 'Site produit', path: 'media/axe/', count: 130 },
  { name: 'Complexe AZA', kind: 'Restaurant', path: 'media/aza/', count: 130 },
  { name: 'DH Studio', kind: 'E-commerce mode', path: 'media/dh/', count: 130 },
]
const TOTAL = 12
const SPEED = 6 // images par seconde : défilement lent, avec fondu entre deux images
const lib = document.getElementById('lib')
lib.innerHTML = Array.from({ length: TOTAL }, (_, i) => {
  const p = PROJECTS[i]
  const n = String(i + 1).padStart(2, '0')
  if (!p) {
    return `<article class="tile soon-tile"><div class="tile-view"><div class="placeholder"><span>${n}</span><em>À venir</em></div></div>
      <div class="tile-meta"><h4>Prochain projet</h4><span>${n}</span></div></article>`
  }
  return `<article class="tile" data-i="${i}"><button class="tile-view browser" aria-label="Voir ${p.name} en grand">
      <span class="browser-bar"><i></i><i></i><i></i><b>${p.name}</b></span>
      <canvas class="proj-canvas"></canvas><span class="scrollbar"><i></i></span><span class="zoom">Voir en grand</span></button>
    <div class="tile-meta"><h4>${p.name}</h4><span>${p.kind}</span></div></article>`
}).join('')

// Lecteur : séquence d'images avec fondu, lent, en boucle
function player(p, canvas, bar, offset = 0) {
  const ctx = canvas.getContext('2d')
  const imgs = []
  let t = offset // position en images (nombre décimal)
  let last = 0
  let playing = false
  const load = () => {
    if (imgs.length) return
    for (let k = 0; k < p.count; k++) {
      const im = new Image()
      im.src = `${p.path}${String(k).padStart(3, '0')}.webp`
      imgs.push(im)
    }
  }
  const ok = (im) => im && im.complete && im.naturalWidth
  const paint = (im, a) => {
    ctx.globalAlpha = a
    const s = Math.max(canvas.width / im.naturalWidth, canvas.height / im.naturalHeight)
    ctx.drawImage(im, (canvas.width - im.naturalWidth * s) / 2, (canvas.height - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s)
  }
  const draw = () => {
    const w = canvas.clientWidth * Math.min(2, devicePixelRatio || 1)
    const h = canvas.clientHeight * Math.min(2, devicePixelRatio || 1)
    if (canvas.width !== w) canvas.width = w
    if (canvas.height !== h) canvas.height = h
    const a = Math.floor(t) % p.count
    const b2 = (a + 1) % p.count
    const f = t - Math.floor(t)
    if (!ok(imgs[a])) return
    paint(imgs[a], 1)
    if (ok(imgs[b2]) && b2 !== 0) paint(imgs[b2], f)
    ctx.globalAlpha = 1
    if (bar) bar.style.transform = `scaleY(${(a + f) / (p.count - 1)})`
  }
  const tick = (now) => {
    if (!playing) return
    const dt = last ? (now - last) / 1000 : 0
    last = now
    t = (t + dt * SPEED) % p.count
    // petite pause en fin de site avant de revenir en haut
    if (t > p.count - 1) t = 0
    draw()
    requestAnimationFrame(tick)
  }
  return {
    play() {
      load()
      if (playing || reduce) {
        imgs[Math.floor(t)].onload = draw
        return draw()
      }
      playing = true
      last = 0
      requestAnimationFrame(tick)
    },
    stop() {
      playing = false
    },
  }
}

const players = []
lib.querySelectorAll('.tile[data-i]').forEach((tile, k) => {
  const p = PROJECTS[+tile.dataset.i]
  const pl = player(p, tile.querySelector('canvas'), tile.querySelector('.scrollbar i'), k * 20)
  players.push(pl)
  ScrollTrigger.create({ trigger: tile, start: 'top bottom', end: 'bottom top', onToggle: (st) => (st.isActive ? pl.play() : pl.stop()) })
  tile.querySelector('.tile-view').addEventListener('click', () => openViewer(p))
})

// Visionneuse plein écran
const viewer = document.getElementById('viewer')
let vPlayer = null
function openViewer(p) {
  viewer.querySelector('.v-title').textContent = p.name
  viewer.querySelector('.v-kind').textContent = p.kind
  viewer.hidden = false
  document.documentElement.classList.add('locked')
  vPlayer = player(p, viewer.querySelector('canvas'), viewer.querySelector('.scrollbar i'))
  requestAnimationFrame(() => {
    viewer.classList.add('open')
    vPlayer.play()
  })
}
function closeViewer() {
  viewer.classList.remove('open')
  vPlayer?.stop()
  document.documentElement.classList.remove('locked')
  setTimeout(() => (viewer.hidden = true), 400)
}
viewer.querySelector('.v-close').addEventListener('click', closeViewer)
viewer.addEventListener('click', (e) => e.target === viewer && closeViewer())
window.addEventListener('keydown', (e) => e.key === 'Escape' && !viewer.hidden && closeViewer())

// Manifeste : les mots s'allument
const mf = document.querySelector('.manifesto p')
mf.innerHTML = mf.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ')
gsap.to('.manifesto .w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'bottom 55%', scrub: true } })

// Étapes : la ligne se remplit, chaque étape s'allume
gsap.to('.steps-line i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 60%', end: 'bottom 60%', scrub: true } })
document.querySelectorAll('.step').forEach((st) => ScrollTrigger.create({ trigger: st, start: 'top 62%', end: 'bottom 62%', toggleClass: 'on' }))

// ═════ Apparitions au défilement ═════
if (!reduce) {
  gsap.utils.toArray('.lib-head, .tile, .soon-card, .footer-cta > *, .service').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 40, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
  })
}
window.addEventListener('load', () => ScrollTrigger.refresh())
