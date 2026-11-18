import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useTransform, useVelocity } from 'framer-motion'
import { LOOK_RATIO, byId, categoryLabel, formatPrice, looks } from '../data/catalog.js'
import { LookVisual, ProductThumb } from '../components/Visuals.jsx'
import { useBag } from '../store.jsx'
import { EASE, useKey, useViewport } from '../hooks.js'

// Taille proposée par défaut quand on ajoute depuis la cabine
const defaultSize = (p) => (p.category === 'shoes' ? '42' : p.category === 'accessory' ? null : 'M')

// Pièces d'un look (slot = identifiant du produit, x/y = point cliquable sur la silhouette)
const lookItems = (look) => look.items.map((it) => ({ slot: it.id, x: it.x, y: it.y, product: byId(it.id) }))
const N = looks.length

// Ramène un décalage dans [-N/2, N/2[ : la rangée boucle à l'infini
const wrap = (v) => ((((v % N) + N) % N) + N / 2) % N - N / 2
const SPRING = { type: 'spring', stiffness: 70, damping: 18, mass: 1 }
const STEP = (Math.PI * 2) / N

export default function Looks() {
  const { w, h } = useViewport()
  const mobile = w < 760

  const pos = useMotionValue(0) // index (flottant) du look au centre
  const openMv = useMotionValue(0) // 0 = rangée, 1 = look ouvert
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [activeSlot, setActiveSlot] = useState(null)

  // Mesures
  const figH = mobile ? Math.min(h * 0.58, 520) : Math.min(h * 0.68, 640)
  const figW = figH * LOOK_RATIO
  // Rayon du cercle : assez large pour que les mannequins de devant couvrent tout l'écran
  const R = mobile ? w * 0.62 : Math.max(figW * 1.6, (w - 60) * 0.47)
  const spacing = R * Math.sin(STEP) // distance horizontale entre deux voisins, devant
  const panelW = mobile ? 0 : 380
  const openScale = mobile ? 0.56 : 1.18
  const openShiftX = -panelW / 2
  const openShiftY = mobile ? -h * 0.37 : 0

  useMotionValueEvent(pos, 'change', (p) => {
    const a = ((Math.round(p) % N) + N) % N
    setActive((cur) => (cur === a ? cur : a))
  })

  const goTo = useCallback((target) => animate(pos, target, SPRING), [pos])
  const step = useCallback((d) => goTo(Math.round(pos.get()) + d), [goTo, pos])
  const goToIndex = useCallback((i) => goTo(Math.round(pos.get() + wrap(i - pos.get()))), [goTo, pos])

  const openLook = useCallback(
    (i) => {
      goToIndex(i)
      setOpen(true)
      animate(openMv, 1, { duration: 0.8, ease: EASE })
    },
    [goToIndex, openMv],
  )
  const closeLook = useCallback(() => {
    setOpen(false)
    setActiveSlot(null)
    animate(openMv, 0, { duration: 0.7, ease: EASE })
  }, [openMv])

  useKey('ArrowRight', () => step(1))
  useKey('ArrowLeft', () => step(-1))
  useKey('Escape', closeLook, open)

  // Molette / trackpad : un cran = un look
  const stageRef = useRef(null)
  const wheelLock = useRef(0)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(d) < 8 || Date.now() - wheelLock.current < 450) return
      wheelLock.current = Date.now()
      step(d > 0 ? 1 : -1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [step])

  // Glisser
  const panStart = useRef(0)
  const panned = useRef(false)

  // Flou de mouvement proportionnel à la vitesse de défilement
  const vel = useVelocity(pos)
  const motionBlur = useTransform(vel, (v) => Math.min(6, Math.abs(v) * 1.6))

  const look = looks[active]

  return (
    <div className="scene looks">
      <div className="scene-title looks-title">
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key={`t-${look.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
              <button className="back-link" onClick={closeLook}>← Tous les looks</button>
              <span className="eyebrow">Look {String(active + 1).padStart(2, '0')}</span>
              <h1 className="title-sm">{look.name}</h1>
            </motion.div>
          ) : (
            <motion.div key="t-all" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
              <h1 className="title-lg">Try the Look.</h1>
              <p className="muted small">{N} looks, stylés de la tête aux pieds. Clique sur un mannequin pour voir les pièces.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        ref={stageRef}
        className="lineup"
        onPanStart={() => {
          pos.stop()
          panStart.current = pos.get()
          panned.current = true
        }}
        onPan={(_, info) => pos.set(panStart.current - info.offset.x / spacing)}
        onPanEnd={(_, info) => {
          goTo(Math.round(pos.get() - info.velocity.x / (spacing * 4)))
          setTimeout(() => (panned.current = false), 60)
        }}
      >
        {looks.map((l, i) => (
          <LineupFigure
            key={l.id}
            look={l}
            i={i}
            pos={pos}
            openMv={openMv}
            motionBlur={motionBlur}
            figW={figW}
            figH={figH}
            R={R}
            mobile={mobile}
            openScale={openScale}
            openShiftX={openShiftX}
            openShiftY={openShiftY}
            isActive={i === active}
            open={open}
            activeSlot={activeSlot}
            setActiveSlot={setActiveSlot}
            onClick={() => {
              if (panned.current) return
              if (open && i === active) return
              openLook(i)
            }}
          />
        ))}
      </motion.div>

      {/* Pagination */}
      <motion.div className="ring-pager" style={{ right: open ? panelW : 0 }} animate={{ opacity: 1 }}>
        <button className="icon-btn" onClick={() => step(-1)} aria-label="Look précédent">←</button>
        <div className="pager-list">
          {looks.map((l, i) => (
            <button key={l.id} className={`pager-item ${i === active ? 'on' : ''}`} onClick={() => goToIndex(i)}>
              <span className="pager-bar" />
              <span className="pager-num">{String(i + 1).padStart(2, '0')}</span>
              {i === active && !mobile && (
                <motion.span key={l.id} className="pager-name" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                  {l.name}
                </motion.span>
              )}
            </button>
          ))}
        </div>
        <button className="icon-btn" onClick={() => step(1)} aria-label="Look suivant">→</button>
      </motion.div>

      {/* Détails du look */}
      <AnimatePresence>
        {open &&
          (mobile ? (
            <motion.div
              key="sheet"
              className="look-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 36, delay: 0.15 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => info.offset.y > 80 && closeLook()}
            >
              <span className="sheet-grip" />
              <LookPanel look={look} index={active} activeSlot={activeSlot} setActiveSlot={setActiveSlot} />
            </motion.div>
          ) : (
            <motion.aside
              key="panel"
              className="look-panel"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
            >
              <LookPanel look={look} index={active} activeSlot={activeSlot} setActiveSlot={setActiveSlot} />
            </motion.aside>
          ))}
      </AnimatePresence>
    </div>
  )
}

function LineupFigure({ look, i, pos, openMv, motionBlur, figW, figH, R, mobile, openScale, openShiftX, openShiftY, isActive, open, activeSlot, setActiveSlot, onClick }) {
  const off = useTransform(pos, (p) => wrap(i - p))
  // Le look central quand on ouvre : 1 pour lui, 0 pour les autres (en douceur)
  const focus = useTransform(off, (o) => Math.max(0, 1 - Math.abs(o) * 2))

  // Position sur le cercle (vu de face) : sin → horizontal, cos → profondeur
  const depth = useTransform(off, (o) => 1 - Math.cos(o * STEP)) // 0 devant → 2 au fond
  const x = useTransform([off, openMv, focus], ([o, t, f]) => {
    const base = Math.sin(o * STEP) * R
    // à l'ouverture, les autres s'écartent vers l'extérieur, le look choisi se place au centre de la zone libre
    return base + t * (1 - f) * base * 0.8 + t * f * openShiftX
  })
  const y = useTransform([depth, openMv, focus], ([d, t, f]) => -d * (mobile ? 14 : 26) * (1 - t * f) + t * f * openShiftY)
  const scale = useTransform([depth, openMv, focus], ([d, t, f]) => {
    const ring = 1 - d * 0.24
    return ring + t * f * (openScale - ring)
  })
  const opacity = useTransform([depth, openMv, focus], ([d, t, f]) => Math.max(0.22, 1 - d * 0.36) * (1 - t * (1 - f)))
  const filter = useTransform([depth, motionBlur, openMv, focus], ([d, b, t, f]) => {
    const ring = d * (mobile ? 1.6 : 2.6) * (1 - t * f)
    return `blur(${(ring + b + t * (1 - f) * 10).toFixed(2)}px)`
  })
  const zIndex = useTransform(depth, (d) => Math.round(300 - d * 100))

  return (
    <motion.div
      className="lineup-figure"
      style={{ x, y, scale, opacity, filter, zIndex, width: figW, height: figH, marginLeft: -figW / 2, pointerEvents: open && !isActive ? 'none' : 'auto' }}
    >
      <motion.button
        className="ring-hit"
        onClick={onClick}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={open ? undefined : { y: -8 }}
        transition={{ type: 'spring', stiffness: 160, damping: 22, delay: 0.05 * ((i + 3) % N) }}
        aria-label={`Voir le look ${look.name}`}
      >
        <LookVisual look={look} className="fill" />
      </motion.button>
    </motion.div>
  )
}

function LookPanel({ look, index, activeSlot, setActiveSlot }) {
  const { add } = useBag()
  const [added, setAdded] = useState(false)
  const products = lookItems(look)
  const total = products.reduce((s, p) => s + p.product.price, 0)

  const addAll = () => {
    add(products.map((p) => ({ product: p.product, size: defaultSize(p.product) })))
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <>
      <div className="panel-head">
        <span>Dans ce look</span>
        <AnimatePresence mode="wait">
          <motion.span key={look.id} className="muted" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            {String(index + 1).padStart(2, '0')} · {look.name}
          </motion.span>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.ul key={look.id} className="panel-list" initial="hidden" animate="show" exit="exit">
          {products.map(({ slot, product }, i) => (
            <motion.li
              key={product.id}
              className={`panel-item ${activeSlot === slot ? 'on' : ''}`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { delay: 0.25 + i * 0.07, duration: 0.4, ease: EASE } },
                exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
              }}
              onMouseEnter={() => setActiveSlot(slot)}
              onMouseLeave={() => setActiveSlot(null)}
            >
              <div className="panel-thumb">
                <ProductThumb product={product} />
              </div>
              <div className="panel-info">
                <span className="eyebrow">{categoryLabel(product)}</span>
                <strong>{product.name}</strong>
                {product.subtitle && <span className="muted">{product.subtitle}</span>}
                <span>{formatPrice(product.price)}</span>
              </div>
              <button className="icon-btn small" onClick={() => add({ product, size: defaultSize(product) })} aria-label={`Ajouter ${product.name}`}>
                +
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
      <div className="panel-foot">
        <div className="row-between">
          <span className="muted">Compléter le look</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <motion.button className={`btn-primary ${added ? 'done' : ''}`} onClick={addAll} whileTap={{ scale: 0.97 }}>
          {added ? 'Ajouté au panier ✓' : 'Ajouter tout le look au panier'}
        </motion.button>
      </div>
    </>
  )
}
