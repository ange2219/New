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
// Chaque projet est une courte vidéo du site qui défile (MP4 léger, ~13 s, en boucle).
// Pour ajouter un projet : déposer media/<nom>.mp4 + media/<nom>-poster.jpg et remplacer une case « À venir ».
const PROJECTS = [
  { name: 'AXE Wild Spice', kind: 'Site produit', video: 'media/axe.mp4', poster: 'media/axe-poster.jpg' },
  { name: 'Complexe AZA', kind: 'Restaurant', video: 'media/aza.mp4', poster: 'media/aza-poster.jpg' },
  { name: 'DH Studio', kind: 'E-commerce mode', video: 'media/dh.mp4', poster: 'media/dh-poster.jpg' },
]
const TOTAL = 12
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
      <video class="proj-video" poster="${p.poster}" muted loop playsinline preload="none"></video>
      <span class="zoom">Voir en grand</span></button>
    <div class="tile-meta"><h4>${p.name}</h4><span>${p.kind}</span></div></article>`
}).join('')

// La vidéo ne joue que quand la case est à l'écran (économise la batterie et les données)
lib.querySelectorAll('.tile[data-i]').forEach((tile, k) => {
  const p = PROJECTS[+tile.dataset.i]
  const v = tile.querySelector('video')
  let started = false
  ScrollTrigger.create({
    trigger: tile,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (st) => {
      if (reduce) return
      if (st.isActive) {
        if (!started) {
          started = true
          // départs décalés (#t=…) pour ne pas voir trois débuts de site en même temps
          v.addEventListener('loadeddata', () => (v.currentTime = k * 4.3), { once: true })
          v.src = p.video
          v.preload = 'auto'
        }
        v.play().catch(() => {})
      } else v.pause()
    },
  })
  tile.querySelector('.tile-view').addEventListener('click', () => openViewer(p))
})

// Visionneuse plein écran
const viewer = document.getElementById('viewer')
const vVideo = viewer.querySelector('video')
function openViewer(p) {
  viewer.querySelector('.v-title').textContent = p.name
  viewer.querySelector('.v-kind').textContent = p.kind
  vVideo.poster = p.poster
  vVideo.src = p.video
  viewer.hidden = false
  document.documentElement.classList.add('locked')
  requestAnimationFrame(() => {
    viewer.classList.add('open')
    vVideo.play().catch(() => {})
  })
}
function closeViewer() {
  viewer.classList.remove('open')
  vVideo.pause()
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
