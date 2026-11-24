// DH Academy — mur de cartes 3D, bibliothèque de démos, défilement doux
const CFG = window.DH || {}
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
gsap.registerPlugin(ScrollTrigger)

// ── Liens : paiement et WhatsApp ───────────────────────────
const wa = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent('Bonjour, je suis intéressé(e) par la Méthode 4K de DH Academy.')}`
document.querySelectorAll('.js-wa').forEach((a) => (a.href = wa))
document.querySelectorAll('.js-checkout').forEach((a) => {
  a.href = CFG.checkoutUrl || wa // sans lien de paiement, le bouton ouvre WhatsApp
  a.target = '_blank'
  a.rel = 'noopener'
})
if (CFG.price) {
  const p = document.querySelector('.js-price')
  p.textContent = CFG.price
  p.hidden = false
}
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

// ═════ HERO : mur de cartes courbé (on est à l'intérieur du cylindre) ═════
const CARDS = [
  ['art-1', 'Module 03', 'Film au<br>scroll'],
  ['art-2', 'Module 05', 'Produit<br>en 3D', 'orb'],
  ['art-9', 'Module 02', 'Motion<br>design'],
  ['art-3', 'Module 05', 'Particules', 'orb'],
  ['art-7', 'Module 01', 'Direction<br>artistique'],
  ['art-5', 'Module 04', 'Visuels<br>IA'],
  ['art-4', 'Module 06', 'E-commerce'],
  ['art-8', 'Module 02', 'Parallaxe', 'orb'],
  ['art-10', 'Module 08', 'Vendre à<br>4 000 €'],
  ['art-6', 'Module 05', 'Three.js'],
  ['art-1', 'Module 02', 'GSAP'],
  ['art-7', 'Module 01', 'Typo<br>éditoriale'],
  ['art-5', 'Module 06', 'Panier<br>animé', 'bars'],
  ['art-2', 'Module 07', 'Mise en<br>ligne'],
  ['art-9', 'Module 03', 'Canvas'],
  ['art-3', 'Module 04', 'Vidéo<br>produit'],
  ['art-8', 'Module 02', 'Lenis'],
  ['art-10', 'Module 08', 'Portfolio'],
]
const ring = document.getElementById('ring')
const stage = document.querySelector('.ring-stage')
const N = CARDS.length
let cw, ch, R
function layoutRing() {
  const w = stage.clientWidth
  ch = stage.clientHeight * 0.78
  cw = ch * 0.74
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

// rotation continue + glisser pour tourner + inclinaison au défilement
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
  // entrée
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('.hero-title .ln > span', { yPercent: 110, duration: 1.4, stagger: 0.1 })
    .from('.hero .eyebrow', { opacity: 0, y: 12, duration: 1 }, 0.1)
    .from('.ring', { opacity: 0, duration: 1.6 }, 0.3)
    .from(rot, { y: -70, duration: 2.6, ease: 'power3.out' }, 0.3)
    .from('.hero-foot > *', { opacity: 0, y: 20, duration: 1, stagger: 0.1 }, 0.8)
}

// ═════ BIBLIOTHÈQUE : démos vivantes ═════
const DEMOS = [
  { cat: 'scroll', name: 'Film au défilement', mod: 'Module 03', badge: 'Signature', html: '<div class="demo d-film"><div class="strip"><div></div><div></div><div></div><div></div></div><div class="can"></div><div class="scrub"><i></i></div></div>' },
  { cat: '3d', name: 'Produit en lévitation', mod: 'Module 05', html: '<div class="demo d-cube"><div class="lift"><div class="cube"><i></i><i></i><i></i><i></i><i></i><i></i></div></div><span class="shadow"></span></div>' },
  { cat: 'type', name: 'Texte cinétique', mod: 'Module 02', html: '<div class="demo d-type"><div class="word">' + [...'Waouh.'].map((c, i) => `<span style="animation-delay:${i * 0.08}s">${c}</span>`).join('') + '</div></div>' },
  { cat: 'ui', name: 'Bouton magnétique', mod: 'Module 02', html: '<div class="demo d-mag"><span class="ring-hint"></span><span class="mbtn">Survole-moi</span></div>', magnetic: true },
  { cat: '3d', name: 'Carrousel en arc', mod: 'Module 05', html: '<div class="demo d-arc"><i></i><i style="animation-delay:-2s"></i><i style="animation-delay:-4s"></i></div>' },
  { cat: 'scroll', name: 'Sections qui se recouvrent', mod: 'Module 02', html: '<div class="demo d-stack"><div></div><div></div></div>' },
  { cat: 'ui', name: 'Verre dépoli & halos', mod: 'Module 01', html: '<div class="demo d-glass"><div class="panel"><b></b><i></i><i></i><i></i></div></div>' },
  { cat: '3d', name: 'Nuage de particules', mod: 'Module 05', badge: 'Nouveau', html: '<div class="demo d-particles"><canvas></canvas></div>', particles: true },
  { cat: 'ui', name: 'Ajout au panier', mod: 'Module 06', html: '<div class="demo d-cart"><div class="prod"></div><span class="btn-add"></span><span class="bag">1</span></div>' },
  { cat: 'scroll', name: 'Parallaxe', mod: 'Module 02', html: '<div class="demo d-para"><span class="sun"></span><span class="l l1"></span><span class="l l2"></span><span class="l l3"></span></div>', parallax: true },
  { cat: 'type', name: 'Mot géant défilant', mod: 'Module 01', html: '<div class="demo d-giant"><div class="row"><span>OBSESSED</span><span>OBSESSED</span><span>OBSESSED</span><span>OBSESSED</span></div></div>' },
  { cat: 'type', name: 'Révélation de mots', mod: 'Module 02', html: '<div class="demo d-reveal"><p>' + 'Chaque mot s’allume au rythme du défilement.'.split(' ').map((w, i) => `<span style="animation-delay:${i * 0.35}s">${w}</span>`).join(' ') + '</p></div>' },
]
const lib = document.getElementById('lib')
lib.innerHTML = DEMOS.map(
  (d) => `<article class="tile" data-cat="${d.cat}">
    <div class="tile-view">${d.badge ? `<span class="badge">${d.badge}</span>` : ''}${d.html}</div>
    <div class="tile-meta"><h4>${d.name}</h4><span>${d.mod}</span></div>
  </article>`,
).join('')

// bouton magnétique
lib.querySelectorAll('.d-mag').forEach((el) => {
  const b = el.querySelector('.mbtn')
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    b.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`
  })
  el.addEventListener('pointerleave', () => (b.style.transform = ''))
})
// parallaxe à la souris
lib.querySelectorAll('.d-para').forEach((el) => {
  const layers = [...el.querySelectorAll('.l, .sun')]
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    layers.forEach((l, i) => (l.style.transform = `translateX(${x * (i + 1) * -14}px)`))
  })
  el.addEventListener('pointerleave', () => layers.forEach((l) => (l.style.transform = '')))
})
// particules : sphère de points qui tourne
lib.querySelectorAll('.d-particles canvas').forEach((cv) => {
  const ctx = cv.getContext('2d')
  const pts = Array.from({ length: 420 }, () => {
    const u = Math.random() * 2 - 1
    const t = Math.random() * Math.PI * 2
    const s = Math.sqrt(1 - u * u)
    return [s * Math.cos(t), u, s * Math.sin(t)]
  })
  let a = 0
  let mx = 0
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
    if (!reduce) requestAnimationFrame(draw)
  }
  draw()
})
// filtres
document.querySelectorAll('.lib-filters button').forEach((b) =>
  b.addEventListener('click', () => {
    document.querySelectorAll('.lib-filters button').forEach((x) => x.classList.toggle('on', x === b))
    const f = b.dataset.f
    const tiles = lib.querySelectorAll('.tile')
    tiles.forEach((t) => t.classList.toggle('hide', f !== 'all' && t.dataset.cat !== f))
    gsap.fromTo([...tiles].filter((t) => !t.classList.contains('hide')), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.6, ease: 'expo.out' })
    ScrollTrigger.refresh()
  }),
)

// ═════ PROGRAMME ═════
const MODULES = [
  ['Penser premium', 'Direction artistique, typographie, grille, rythme. Ce qui sépare un site à 300 € d’un site à 4 000 €.', ['Moodboard', 'Typographie', 'Grille']],
  ['Animer au défilement', 'GSAP, ScrollTrigger, Lenis : apparitions, sections épinglées, parallaxe, défilement fluide.', ['GSAP', 'ScrollTrigger', 'Lenis']],
  ['Le film au scroll', 'De la vidéo aux images, du canvas à la timeline : faire défiler un film au rythme du doigt.', ['Canvas', 'Timeline', 'Optimisation']],
  ['Produire les visuels', 'Générer packshots, ambiances et vidéos produit avec l’IA, puis les détourer et les compresser.', ['IA', 'Détourage', 'WebP']],
  ['3D et interactions', 'Modèles 3D, rotations, particules, carrousels en arc, interactions à la souris.', ['Three.js', 'model-viewer', 'Shaders']],
  ['E-commerce animé', 'Fiches produit, variantes, panier, animation d’ajout, tunnel de commande.', ['React', 'Panier', 'Paiement']],
  ['Mettre en ligne', 'GitHub, hébergement, nom de domaine, performance, mobile et référencement.', ['GitHub', 'Vercel', 'SEO']],
  ['Vendre ses sites', 'Portfolio, prix, devis, prospection : présenter et défendre un site à 4 000 €.', ['Prix', 'Devis', 'Prospection']],
]
const mods = document.getElementById('modules')
mods.innerHTML = MODULES.map(
  ([t, d, c], i) => `<article class="module"><span class="glow"></span><span class="mn">Module ${String(i + 1).padStart(2, '0')}</span><h4>${t}</h4><p>${d}</p><div class="chips">${c.map((x) => `<span>${x}</span>`).join('')}</div></article>`,
).join('')
mods.querySelectorAll('.module').forEach((m) => {
  const g = m.querySelector('.glow')
  m.addEventListener('pointermove', (e) => {
    const r = m.getBoundingClientRect()
    g.style.left = `${e.clientX - r.left}px`
    g.style.top = `${e.clientY - r.top}px`
  })
})

// ═════ Apparitions au défilement ═════
if (!reduce) {
  gsap.utils.toArray('.lib-head, .lib-filters, .tile, .module, .faq-list details, .offer-card, .footer-cta > *').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 40, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
  })
  gsap.utils.toArray('.method-steps article').forEach((el) => {
    gsap.from(el, { opacity: 0.15, x: 40, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 40%', scrub: true } })
  })
  gsap.from('.method-big', { scale: 0.7, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.method', start: 'top 85%', end: 'top 30%', scrub: true } })
}
// compteurs
document.querySelectorAll('.stats b[data-n]').forEach((b) => {
  const o = { v: 0 }
  gsap.to(o, { v: +b.dataset.n, duration: 1.8, ease: 'power3.out', onUpdate: () => (b.textContent = Math.round(o.v)), scrollTrigger: { trigger: b, start: 'top 88%' } })
})

window.addEventListener('load', () => ScrollTrigger.refresh())
