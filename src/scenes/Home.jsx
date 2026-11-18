import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { BRAND, LOOK_RATIO, accessories, byId, formatPrice, looks, sneakers, tops } from '../data/catalog.js'
import { AccessoryVisual, GarmentVisual, LookVisual, ProductThumb, SneakerVisual } from '../components/Visuals.jsx'
import { EASE, useViewport } from '../hooks.js'

// Contexte : conteneur de défilement + hauteur d'un écran
const ScrollCtx = createContext(null)

export default function Home({ onNavigate }) {
  const scrollRef = useRef(null)
  const [ph, setPh] = useState(() => window.innerHeight - 64)

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const measure = () => setPh(el.clientHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ container: scrollRef })
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  return (
    <ScrollCtx.Provider value={{ scrollRef, ph }}>
      <div className="home-scroll" ref={scrollRef}>
        <Panel index={0} first className="tone-light">
          {(p) => <Hero {...p} onNavigate={onNavigate} />}
        </Panel>
        <Panel index={1} length={0.8} className="tone-dark">
          {(p) => <Manifesto {...p} />}
        </Panel>
        <Panel index={2} length={2.6} className="tone-light">
          {(p) => <NewCollection {...p} onNavigate={onNavigate} />}
        </Panel>
        <Panel index={3} className="tone-stone">
          {(p) => <Cabin {...p} onNavigate={onNavigate} />}
        </Panel>
        <Panel index={4} length={1.2} className="tone-dark">
          {(p) => <SneakerShow {...p} onNavigate={onNavigate} />}
        </Panel>
        <Panel index={5} className="tone-light">
          {(p) => <AccShow {...p} onNavigate={onNavigate} />}
        </Panel>
        <Footer onNavigate={onNavigate} />
      </div>
      <motion.div className="home-progress" style={{ scaleX: bar }} />
    </ScrollCtx.Provider>
  )
}

// ── Panneau collant : il reste en place, puis recule pendant que le suivant glisse par-dessus ──
function Panel({ index, length = 0, first, className, children }) {
  const { scrollRef, ph } = useContext(ScrollCtx)
  const ref = useRef(null)
  const total = 1 + length // en écrans
  const { scrollYProgress } = useScroll({ container: scrollRef, target: ref, offset: ['start start', 'end end'] })
  const { scrollYProgress: enter } = useScroll({ container: scrollRef, target: ref, offset: ['start end', 'start start'] })

  const split = length / total
  const inner = useTransform(scrollYProgress, (v) => (split ? Math.min(1, v / split) : 1))
  const exit = useTransform(scrollYProgress, (v) => Math.max(0, (v - split) / (1 - split)))

  const scale = useTransform(exit, [0, 1], [1, 0.88])
  const y = useTransform(exit, [0, 1], [0, -ph * 0.05])
  const opacity = useTransform(exit, [0, 0.9], [1, 0.25])
  const filter = useTransform(exit, (x) => `blur(${(x * 8).toFixed(2)}px)`)
  const radius = useTransform([enter, exit], ([e, x]) => {
    const top = Math.max(first ? 0 : 1 - e, x) * 32
    return `${top}px ${top}px ${x * 32}px ${x * 32}px`
  })

  return (
    <section
      ref={ref}
      className="panel-wrap"
      style={{ height: ph * (1 + total), marginTop: first ? 0 : -ph, zIndex: index + 1 }}
    >
      <motion.div className={`panel ${className}`} style={{ height: ph, scale, y, opacity, filter, borderRadius: radius }}>
        {children({ inner, enter, exit, ph })}
      </motion.div>
    </section>
  )
}

// ── 1. Hero ─────────────────────────────────────────────────
const FLOATS = [
  { id: 'overshirt-brooklyn', left: 5, top: 12, w: 15, rot: -12, depth: 30, m: { left: 2, top: 3, w: 30 } },
  { id: 'boots-tan', left: 73, top: 6, w: 16, rot: 10, depth: 45, m: { left: 62, top: 2, w: 34 } },
  { id: 'polo-arodr', left: 80, top: 50, w: 13, rot: 10, depth: 25, m: { left: 70, top: 78, w: 26 } },
  { id: 'derby-two-tone', left: 3, top: 66, w: 16, rot: -8, depth: 40, m: { left: 4, top: 82, w: 34 } },
  { id: 'beanie-bordeaux', left: 68, top: 76, w: 7, rot: -6, depth: 18 },
  { id: 'beret-leather', left: 25, top: 4, w: 8, rot: 8, depth: 14 },
  { id: 'shade-round', left: 26, top: 85, w: 9, rot: -10, depth: 22 },
  { id: 'watch-gold', left: 93, top: 34, w: 3.6, rot: 16, depth: 35 },
  { id: 'cross-gold', left: 13, top: 44, w: 4.5, rot: 6, depth: 20 },
]

function Hero({ exit, onNavigate }) {
  const { w } = useViewport()
  const mobile = w < 760
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const titleY = useTransform(exit, [0, 1], [0, -120])
  const floatsY = useTransform(exit, [0, 1], [0, -220])

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const letters = BRAND.name.split(' ')

  return (
    <div className="hero" onMouseMove={onMove}>
      <motion.div className="hero-floats" style={{ y: floatsY }}>
        {FLOATS.slice(0, mobile ? 4 : FLOATS.length).map((f, i) => (
          <Float key={f.id} f={f} i={i} mx={mx} my={my} mobile={mobile} />
        ))}
      </motion.div>

      <motion.div className="hero-center" style={{ y: titleY }}>
        <motion.span className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          Prêt-à-porter · Automne / Hiver 26
        </motion.span>
        <h1 className="hero-title" aria-label={BRAND.name}>
          {letters.map((word, wi) => (
            <span key={word} className="hero-word">
              {word.split('').map((ch, ci) => (
                <span key={ci} className="hero-mask">
                  <motion.span
                    className="hero-char"
                    initial={{ y: '110%', rotate: 8 }}
                    animate={{ y: '0%', rotate: 0 }}
                    transition={{ duration: 1, ease: EASE, delay: 0.3 + wi * 0.25 + ci * 0.05 }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        <motion.p className="hero-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7, ease: EASE }}>
          Des basiques lourds, des coupes amples, et une cabine virtuelle pour tout essayer avant d'acheter.
        </motion.p>
        <motion.div className="hero-ctas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7, ease: EASE }}>
          <button className="btn-pill dark" onClick={() => onNavigate('looks')}>Entrer dans la cabine</button>
          <button className="btn-pill" onClick={() => onNavigate('rack')}>Voir la collection</button>
        </motion.div>
      </motion.div>

      <motion.div className="scroll-hint-home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
        <span>Défiler</span>
        <motion.i animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
    </div>
  )
}

function Float({ f, i, mx, my, mobile }) {
  const x = useTransform(mx, (v) => v * f.depth * 2)
  const y = useTransform(my, (v) => v * f.depth * 2)
  const pos = mobile && f.m ? f.m : f
  const product = byId(f.id)
  return (
    <motion.div
      className="float"
      style={{ left: `${pos.left}%`, top: `${pos.top}%`, width: `${pos.w}vw`, x, y }}
      initial={{ opacity: 0, scale: 0.6, rotate: f.rot * 2 }}
      animate={{ opacity: 1, scale: 1, rotate: f.rot }}
      transition={{ delay: 0.6 + i * 0.12, type: 'spring', stiffness: 60, damping: 14 }}
    >
      <motion.div animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }} transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}>
        <ProductThumb product={product} className="fill" />
      </motion.div>
    </motion.div>
  )
}

// ── 2. Manifeste : les mots s'allument au fil du défilement ──
const MANIFESTO =
  "On fabrique des pièces faites pour être portées, pas seulement regardées. Coton lourd, coupes amples, couleurs calmes. Et parce qu'on sait que tu veux voir avant d'acheter, on a construit une cabine."

function Manifesto({ inner, enter }) {
  const words = MANIFESTO.split(' ')
  const contentY = useTransform(enter, [0, 1], [120, 0])
  return (
    <div className="manifesto">
      <motion.span className="eyebrow light" style={{ y: contentY }}>Notre idée</motion.span>
      <motion.p className="manifesto-text" style={{ y: contentY }}>
        {words.map((wd, i) => (
          <Word key={i} progress={inner} range={[i / words.length, (i + 1.5) / words.length]}>
            {wd}
          </Word>
        ))}
      </motion.p>
    </div>
  )
}

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const y = useTransform(progress, range, [8, 0])
  return (
    <motion.span className="mword" style={{ opacity, y }}>
      {children}{' '}
    </motion.span>
  )
}

// ── 3. Nouvelle collection : défilement horizontal piloté par le défilement vertical ──
function NewCollection({ inner, enter, onNavigate }) {
  const trackRef = useRef(null)
  const [dist, setDist] = useState(0)
  const { w } = useViewport()
  useEffect(() => {
    if (trackRef.current) setDist(Math.max(0, trackRef.current.scrollWidth - w + 40))
  }, [w])
  // défilement plus lent et amorti pour un mouvement plus doux
  const rawX = useTransform(inner, [0, 1], [0, -dist])
  const x = useSpring(rawX, { stiffness: 90, damping: 26, mass: 0.6 })
  const headY = useTransform(enter, [0, 1], [100, 0])
  const headO = useTransform(enter, [0.4, 1], [0, 1])
  const items = tops.slice(0, 9)

  return (
    <div className="newcol">
      <motion.div className="newcol-head" style={{ y: headY, opacity: headO }}>
        <div>
          <span className="eyebrow">Nouveautés · {items.length} pièces</span>
          <h2 className="section-title">Nouvelle collection</h2>
        </div>
        <button className="btn-pill" onClick={() => onNavigate('rack')}>Tout voir</button>
      </motion.div>
      <motion.div className="newcol-track" ref={trackRef} style={{ x }}>
        {items.map((p, i) => (
          <CollectionCard key={p.id} p={p} i={i} inner={inner} onClick={() => onNavigate('rack')} />
        ))}
      </motion.div>
    </div>
  )
}

function CollectionCard({ p, i, inner, onClick }) {
  // léger décalage vertical alterné qui s'aplanit en défilant
  const y = useTransform(inner, [0, 1], [i % 2 ? 40 : -20, i % 2 ? -20 : 30])
  return (
    <motion.button className="col-card" style={{ y }} onClick={onClick} whileHover="hover">
      <motion.div className="col-card-img" variants={{ hover: { scale: 1.05, rotate: -2 } }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
        <GarmentVisual product={p} className="fill" />
      </motion.div>
      <div className="col-card-info">
        <span>{p.name}</span>
        <span className="muted">{formatPrice(p.price)}</span>
      </div>
    </motion.button>
  )
}

// ── 4. Cabine virtuelle : aperçu avec les mannequins qui tournent ──
function Cabin({ enter, onNavigate }) {
  const { w, h } = useViewport()
  const mobile = w < 760
  const rot = useMotionValue(0)
  useEffect(() => {
    const c = animate(rot, looks.length, { duration: 28, ease: 'linear', repeat: Infinity })
    return () => c.stop()
  }, [rot])
  const textY = useTransform(enter, [0, 1], [140, 0])
  const textO = useTransform(enter, [0.3, 1], [0, 1])
  const ringScale = useTransform(enter, [0, 1], [0.8, 1])
  const figH = mobile ? h * 0.36 : Math.min(h * 0.6, 520)
  const R = mobile ? w * 0.36 : Math.min(w * 0.22, 340)

  return (
    <div className="cabin">
      <motion.div className="cabin-text" style={{ y: textY, opacity: textO }}>
        <span className="eyebrow">Nouveau</span>
        <h2 className="section-title">La cabine virtuelle</h2>
        <p className="muted">
          Fais tourner les looks, clique sur une silhouette et vois chaque pièce portée. Ajoute la tenue complète au panier en un geste.
        </p>
        <ol className="cabin-steps">
          <li><b>Choisis</b> un look sur le cercle</li>
          <li><b>Touche</b> les pièces qui te plaisent</li>
          <li><b>Ajoute</b> le look entier ou pièce par pièce</li>
        </ol>
        <button className="btn-pill dark" onClick={() => onNavigate('looks')}>Essayer maintenant</button>
      </motion.div>
      <motion.div className="cabin-ring" style={{ scale: ringScale }} onClick={() => onNavigate('looks')}>
        {looks.map((l, i) => (
          <CabinFigure key={l.id} look={l} i={i} rot={rot} R={R} figH={figH} />
        ))}
      </motion.div>
    </div>
  )
}

function CabinFigure({ look, i, rot, R, figH }) {
  const n = looks.length
  const a = useTransform(rot, (r) => (i - r) * ((Math.PI * 2) / n))
  const x = useTransform(a, (v) => Math.sin(v) * R)
  const d = useTransform(a, (v) => 1 - Math.cos(v))
  const scale = useTransform(d, (v) => 1 - v * 0.22)
  const y = useTransform(d, (v) => -v * 18)
  const opacity = useTransform(d, (v) => Math.max(0.2, 1 - v * 0.38))
  const filter = useTransform(d, (v) => `blur(${(v * 2).toFixed(2)}px)`)
  const zIndex = useTransform(d, (v) => Math.round(300 - v * 100))
  const figW = figH * LOOK_RATIO
  return (
    <motion.div className="cabin-fig" style={{ x, y, scale, opacity, filter, zIndex, width: figW, height: figH, marginLeft: -figW / 2 }}>
      <LookVisual look={look} className="fill" />
    </motion.div>
  )
}

// ── 5. Sneakers : la paire tourne et grossit avec le défilement ──
function SneakerShow({ inner, enter, onNavigate }) {
  const featured = sneakers.slice(0, 3)
  const [idx, setIdx] = useState(0)
  useEffect(() => inner.on('change', (v) => setIdx(Math.min(featured.length - 1, Math.floor(v * featured.length * 0.999)))), [inner, featured.length])
  const s = featured[idx]
  const local = useTransform(inner, (v) => (v * featured.length) % 1)
  const rotate = useTransform(local, [0, 0.5, 1], [-18, -6, 6])
  const scale = useTransform(local, [0, 0.5, 1], [0.85, 1.05, 0.95])
  const shoeY = useTransform(enter, [0, 1], [200, 0])
  const wordX = useTransform(inner, [0, 1], ['0%', '-45%'])

  return (
    <div className="sshow">
      <motion.div className="sshow-word" style={{ x: wordX }} aria-hidden="true">
        {BRAND.bigWord} {BRAND.bigWord} {BRAND.bigWord}
      </motion.div>
      <div className="sshow-head">
        <span className="eyebrow light">Chaussures · {String(idx + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}</span>
        <motion.h2 key={s.id} className="section-title light" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
          {s.name}
        </motion.h2>
        <motion.p key={`${s.id}-p`} className="muted-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {s.subtitle} · {formatPrice(s.price)}
        </motion.p>
      </div>
      <motion.div className="sshow-shoe" style={{ y: shoeY }}>
        <motion.div style={{ rotate, scale }}>
          <motion.div key={s.id} initial={{ opacity: 0, x: 120, rotateY: 40 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
              <SneakerVisual product={s} className="fill" />
            </motion.div>
          </motion.div>
        </motion.div>
        <div className="sshow-shadow" />
      </motion.div>
      <button className="btn-pill light sshow-cta" onClick={() => onNavigate('sneakers')}>Toutes les chaussures</button>
    </div>
  )
}

// ── 6. Accessoires : les pièces se placent en orbite ──
function AccShow({ enter, onNavigate }) {
  const picks = ['shade-round', 'beanie-88', 'chain-forcat', 'watch-steel-diver', 'bag-woven', 'gloves-leather'].map(byId)
  const headY = useTransform(enter, [0, 1], [100, 0])
  return (
    <div className="accshow">
      <motion.div className="accshow-head" style={{ y: headY }}>
        <span className="eyebrow">Pour finir le look</span>
        <h2 className="section-title">Accessoires</h2>
        <p className="muted">Lunettes, bonnets, colliers, montres, ceintures, sacs et gants.</p>
        <button className="btn-pill dark" onClick={() => onNavigate('accessories')}>Voir les accessoires</button>
      </motion.div>
      <div className="accshow-grid">
        {picks.map((a, i) => (
          <AccTile key={a.id} a={a} i={i} enter={enter} onClick={() => onNavigate('accessories')} />
        ))}
      </div>
    </div>
  )
}

function AccTile({ a, i, enter, onClick }) {
  const y = useTransform(enter, [0, 1], [160 + i * 40, 0])
  const rotate = useTransform(enter, [0, 1], [i % 2 ? 20 : -20, 0])
  return (
    <motion.button className="accshow-tile" style={{ y, rotate }} onClick={onClick} whileHover={{ y: -8, scale: 1.04 }}>
      <motion.div className="fill" animate={{ y: [0, -8, 0] }} transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}>
        <AccessoryVisual product={a} className="fill" />
      </motion.div>
      <span>{a.name}</span>
    </motion.button>
  )
}

// ── 7. Pied de page ─────────────────────────────────────────
function Footer({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <footer className="home-footer">
      <div className="footer-top">
        <div>
          <h2 className="section-title">Rejoins le club</h2>
          <p className="muted">Les sorties en avant-première et −10 % sur ta première commande.</p>
        </div>
        <form
          className="newsletter"
          onSubmit={(e) => {
            e.preventDefault()
            if (email.includes('@')) setDone(true)
          }}
        >
          {done ? (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="nl-done">
              Merci, tu es inscrit·e.
            </motion.p>
          ) : (
            <>
              <input id="nl-email" type="email" placeholder="ton@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button className="btn-pill dark" type="submit">S'inscrire</button>
            </>
          )}
        </form>
      </div>
      <div className="footer-cols">
        <div>
          <b>Boutique</b>
          <button onClick={() => onNavigate('rack')}>Collection</button>
          <button onClick={() => onNavigate('sneakers')}>Sneakers</button>
          <button onClick={() => onNavigate('accessories')}>Accessoires</button>
          <button onClick={() => onNavigate('looks')}>Cabine virtuelle</button>
        </div>
        <div>
          <b>Aide</b>
          <span>Livraison offerte dès 100 €</span>
          <span>Retours gratuits 30 jours</span>
          <span>Guide des tailles</span>
        </div>
        <div>
          <b>Studio</b>
          <span>Notre histoire</span>
          <span>Instagram</span>
          <span>Contact</span>
        </div>
      </div>
      <div className="footer-brand" aria-hidden="true">{BRAND.name}</div>
    </footer>
  )
}
