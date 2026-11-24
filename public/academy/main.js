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
// Pour ajouter un projet : remplacer une case « À venir » par un objet comme ceux-ci.
const PROJECTS = [
  { name: 'AXE Wild Spice', kind: 'Site produit', frames: { path: 'media/axe/', count: 66, fps: 18 } },
  { name: 'Complexe AZA', kind: 'Restaurant', frames: { path: 'media/aza/', count: 79, fps: 18 } },
  { name: 'DH Studio', kind: 'E-commerce mode', slides: ['media/dh/0.webp', 'media/dh/1.webp', 'media/dh/2.webp', 'media/dh/3.webp', 'media/dh/4.webp'] },
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
  const view = p.frames ? '<canvas class="proj-canvas"></canvas>' : `<div class="proj-slides">${p.slides.map((s, k) => `<img src="${s}" alt="" class="${k ? '' : 'on'}" />`).join('')}</div>`
  return `<article class="tile" data-i="${i}"><div class="tile-view">${view}</div>
    <div class="tile-meta"><h4>${p.name}</h4><span>${p.kind}</span></div></article>`
}).join('')

// Animation des cases : séquences d'images sur canvas, diaporama pour DH Studio
lib.querySelectorAll('.tile[data-i]').forEach((tile) => {
  const p = PROJECTS[+tile.dataset.i]
  let playing = false
  if (p.frames) {
    const cv = tile.querySelector('canvas')
    const ctx = cv.getContext('2d')
    const imgs = []
    let f = 0
    let last = 0
    const load = () => {
      for (let k = 0; k < p.frames.count; k++) {
        const im = new Image()
        im.src = `${p.frames.path}${String(k).padStart(3, '0')}.webp`
        imgs.push(im)
      }
    }
    const draw = () => {
      const im = imgs[f]
      if (!im?.complete || !im.naturalWidth) return
      cv.width = cv.clientWidth * 2
      cv.height = cv.clientHeight * 2
      const s = Math.max(cv.width / im.naturalWidth, cv.height / im.naturalHeight)
      ctx.drawImage(im, (cv.width - im.naturalWidth * s) / 2, (cv.height - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s)
    }
    const tick = (t) => {
      if (!playing) return
      if (t - last > 1000 / p.frames.fps) {
        last = t
        f = (f + 1) % p.frames.count
        draw()
      }
      requestAnimationFrame(tick)
    }
    ScrollTrigger.create({
      trigger: tile,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => {
        if (!imgs.length) {
          load()
          imgs[0].onload = draw
        }
      },
      onToggle: (st) => {
        playing = st.isActive && !reduce
        if (playing) requestAnimationFrame(tick)
      },
    })
  } else {
    const imgs = tile.querySelectorAll('img')
    let k = 0
    setInterval(() => {
      if (reduce) return
      imgs[k].classList.remove('on')
      k = (k + 1) % imgs.length
      imgs[k].classList.add('on')
    }, 1800)
  }
})

// ═════ Apparitions au défilement ═════
if (!reduce) {
  gsap.utils.toArray('.lib-head, .tile, .soon-card, .footer-cta > *').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 40, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
  })
}
window.addEventListener('load', () => ScrollTrigger.refresh())
