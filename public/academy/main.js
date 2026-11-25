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
// Chaque projet est un montage des meilleurs passages du site (MP4 léger, ~10 s, 30 images/s, en boucle).
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
          v.addEventListener('loadeddata', () => (v.currentTime = k * 2.2), { once: true })
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

// ═════ BIBLIOTHÈQUE : 8 animations en direct + cases verrouillées ═════
const ANIMS = [
  { fr: 'Film au défilement', en: 'Scroll image sequence', html: '<div class="demo d-film"><div class="strip"><div></div><div></div><div></div><div></div></div><div class="can"></div><div class="scrub"><i></i></div></div>' },
  { fr: 'Produit en lévitation', en: '3D floating object', html: '<div class="demo d-cube"><div class="lift"><div class="cube"><i></i><i></i><i></i><i></i><i></i><i></i></div></div><span class="shadow"></span></div>' },
  { fr: 'Lettres en vague', en: 'Split text animation', html: '<div class="demo d-type"><div class="word">' + [...'Waouh.'].map((c, i) => `<span style="animation-delay:${i * 0.08}s">${c}</span>`).join('') + '</div></div>' },
  { fr: 'Bouton magnétique', en: 'Magnetic button', html: '<div class="demo d-mag"><span class="ring-hint"></span><span class="mbtn">Survole-moi</span></div>' },
  { fr: 'Carrousel en arc', en: 'Arc carousel', html: '<div class="demo d-arc"><i></i><i style="animation-delay:-2s"></i><i style="animation-delay:-4s"></i></div>' },
  { fr: 'Sections qui se recouvrent', en: 'Stacking sections', html: '<div class="demo d-stack"><div></div><div></div></div>' },
  { fr: 'Nuage de particules', en: 'Particle sphere', html: '<div class="demo d-particles"><canvas></canvas></div>' },
  { fr: 'Produit vers le panier', en: 'Add to cart fly', html: '<div class="demo d-cart"><div class="prod"></div><span class="btn-add"></span><span class="bag">1</span></div>' },
]
const LOCKED = ['Parallaxe à la souris', 'Mots qui s’allument', 'Transition de page', 'Curseur personnalisé']
const anims = document.getElementById('anims')
anims.innerHTML =
  ANIMS.map((a) => `<article class="tile"><div class="tile-view">${a.html}</div><div class="tile-meta"><h4>${a.fr}</h4><span>${a.en}</span></div></article>`).join('') +
  LOCKED.map((n, i) => `<article class="tile locked-tile"><div class="tile-view"><div class="locked-art l${i}"></div><div class="lock"><span>🔒</span><b>Dans la formation</b></div></div><div class="tile-meta"><h4>${n}</h4><span>+${32 - i * 0}</span></div></article>`).join('')
anims.querySelectorAll('.locked-tile .tile-meta span').forEach((s, i) => (s.textContent = i === 3 ? '+ 32 autres' : ''))

anims.querySelectorAll('.d-mag').forEach((el) => {
  const b = el.querySelector('.mbtn')
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect()
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.35}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`
  })
  el.addEventListener('pointerleave', () => (b.style.transform = ''))
})
anims.querySelectorAll('.d-particles canvas').forEach((cv) => {
  const ctx = cv.getContext('2d')
  const pts = Array.from({ length: 420 }, () => {
    const u = Math.random() * 2 - 1
    const t = Math.random() * Math.PI * 2
    const s = Math.sqrt(1 - u * u)
    return [s * Math.cos(t), u, s * Math.sin(t)]
  })
  let a = 0
  let mx = 0
  let on = false
  cv.parentElement.addEventListener('pointermove', (e) => {
    const r = cv.getBoundingClientRect()
    mx = (e.clientX - r.left) / r.width - 0.5
  })
  const draw = () => {
    const w = (cv.width = cv.clientWidth * 2)
    const h = (cv.height = cv.clientHeight * 2)
    ctx.clearRect(0, 0, w, h)
    a += 0.004 + mx * 0.02
    const R = Math.min(w, h) * 0.34
    for (const [x, y, z] of pts) {
      const X = x * Math.cos(a) - z * Math.sin(a)
      const Z = x * Math.sin(a) + z * Math.cos(a)
      const k = (Z + 2) / 3
      ctx.fillStyle = `rgba(${Z > 0 ? '255,140,90' : '160,170,255'},${0.25 + k * 0.6})`
      ctx.beginPath()
      ctx.arc(w / 2 + X * R, h / 2 + y * R, 1.2 + k * 1.6, 0, Math.PI * 2)
      ctx.fill()
    }
    if (on && !reduce) requestAnimationFrame(draw)
  }
  ScrollTrigger.create({ trigger: cv, start: 'top bottom', end: 'bottom top', onToggle: (st) => { on = st.isActive; if (on) draw() } })
  draw()
})
// compteur 0 → 40
const bc = document.querySelector('.big-count')
const cnt = { v: 0 }
gsap.to(cnt, { v: 40, duration: 1.8, ease: 'power3.out', onUpdate: () => (bc.textContent = `${Math.round(cnt.v)}+`), scrollTrigger: { trigger: bc, start: 'top 85%' } })

// Manifeste : les mots s'allument
const mf = document.querySelector('.manifesto p')
mf.innerHTML = mf.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ')
gsap.to('.manifesto .w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'bottom 55%', scrub: true } })

// Étapes : la ligne se remplit, chaque étape s'allume
gsap.to('.steps-line i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 60%', end: 'bottom 60%', scrub: true } })
document.querySelectorAll('.step').forEach((st) => ScrollTrigger.create({ trigger: st, start: 'top 62%', end: 'bottom 62%', toggleClass: 'on' }))

// ═════ Apparitions au défilement ═════
if (!reduce) {
  gsap.utils.toArray('.lib-head, .tile, .soon-card, .footer-cta > *, .service, .gain, .ba-col').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 40, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
  })
}
window.addEventListener('load', () => ScrollTrigger.refresh())
