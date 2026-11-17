import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import { byId, formatPrice, looks } from '../data/catalog.js'
import { LookVisual, ProductThumb } from '../components/Visuals.jsx'
import { FIGURE_HOTSPOTS } from '../components/art/Figure.jsx'
import { useBag } from '../store.jsx'
import { EASE, useKey, useViewport } from '../hooks.js'

const SLOTS = ['top', 'bottom', 'shoes']
const CATEGORY = { top: 'Haut', bottom: 'Bas', shoes: 'Sneakers' }
const N = looks.length
const STEP = (Math.PI * 2) / N

// Ramène un décalage dans l'intervalle [-N/2, N/2[ pour que le cercle boucle
const wrap = (v) => ((((v % N) + N) % N) + N / 2) % N - N / 2

export default function Looks() {
  const { w, h } = useViewport()
  const mobile = w < 760
  const pos = useMotionValue(-3) // position (en index flottant) du cercle
  const [active, setActive] = useState(0)
  const [activeSlot, setActiveSlot] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const lastInteraction = useRef(0)

  // Rayon du cercle et taille des mannequins
  const stageW = mobile ? w : w - 380
  const R = mobile ? w * 0.44 : Math.min(stageW * 0.4, 560)
  const figH = mobile ? Math.min(h * 0.5, 460) : Math.min(h * 0.66, 640)

  useMotionValueEvent(pos, 'change', (p) => {
    const a = ((Math.round(p) % N) + N) % N
    setActive((cur) => (cur === a ? cur : a))
  })

  const goTo = useCallback(
    (target) => {
      animate(pos, target, { type: 'spring', stiffness: 60, damping: 16, mass: 1 })
    },
    [pos],
  )
  const step = useCallback(
    (d) => {
      lastInteraction.current = Date.now()
      goTo(Math.round(pos.get()) + d)
    },
    [goTo, pos],
  )

  // Entrée : le cercle fait un tour pour se mettre en place
  useEffect(() => {
    const c = animate(pos, 0, { duration: 1.8, ease: EASE })
    return () => c.stop()
  }, [pos])

  // Rotation automatique douce, suspendue dès que l'on interagit
  useEffect(() => {
    const t = setInterval(() => {
      if (Date.now() - lastInteraction.current > 9000 && !sheetOpen) goTo(Math.round(pos.get()) + 1)
    }, 4800)
    return () => clearInterval(t)
  }, [goTo, pos, sheetOpen])

  useKey('ArrowRight', () => step(1))
  useKey('ArrowLeft', () => step(-1))
  useKey('Escape', () => setSheetOpen(false), sheetOpen)

  // Molette
  const stageRef = useRef(null)
  const wheelLock = useRef(0)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(d) < 8 || Date.now() - wheelLock.current < 520) return
      wheelLock.current = Date.now()
      step(d > 0 ? 1 : -1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [step])

  // Glisser pour faire tourner
  const panStart = useRef(0)
  const panned = useRef(false)

  const pick = (i) => {
    if (panned.current) return
    lastInteraction.current = Date.now()
    const off = wrap(i - pos.get())
    if (Math.abs(off) < 0.3) {
      if (mobile) setSheetOpen(true)
      return
    }
    goTo(Math.round(pos.get() + off))
  }

  const look = looks[active]

  return (
    <div className="scene looks">
      <div className="scene-title looks-title">
        <h1 className="title-lg">Try the Look.</h1>
        <p className="muted small">{N} looks, stylés de la tête aux pieds. Touche un point pour voir la pièce.</p>
      </div>

      <motion.div
        ref={stageRef}
        className="ring-stage"
        style={{ right: mobile ? 0 : 380 }}
        onPanStart={() => {
          pos.stop()
          panStart.current = pos.get()
          panned.current = true
          lastInteraction.current = Date.now()
        }}
        onPan={(_, info) => pos.set(panStart.current - info.offset.x / (R * 1.1))}
        onPanEnd={(_, info) => {
          const projected = pos.get() - info.velocity.x / (R * 3.2)
          goTo(Math.round(projected))
          setTimeout(() => (panned.current = false), 60)
        }}
      >
        <div className="ring-floor" />
        {looks.map((l, i) => (
          <RingFigure
            key={l.id}
            look={l}
            i={i}
            pos={pos}
            R={R}
            figH={figH}
            mobile={mobile}
            isActive={i === active}
            activeSlot={activeSlot}
            setActiveSlot={setActiveSlot}
            onPick={() => pick(i)}
          />
        ))}
      </motion.div>

      {/* Pagination en bas */}
      <div className="ring-pager" style={{ right: mobile ? 0 : 380 }}>
        <button className="icon-btn" onClick={() => step(-1)} aria-label="Look précédent">←</button>
        <div className="pager-list">
          {looks.map((l, i) => (
            <button
              key={l.id}
              className={`pager-item ${i === active ? 'on' : ''}`}
              onClick={() => {
                lastInteraction.current = Date.now()
                goTo(Math.round(pos.get() + wrap(i - pos.get())))
              }}
            >
              <span className="pager-bar" />
              <span className="pager-num">{String(i + 1).padStart(2, '0')}</span>
              {i === active && !mobile && (
                <motion.span className="pager-name" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                  {l.name}
                </motion.span>
              )}
            </button>
          ))}
        </div>
        <button className="icon-btn" onClick={() => step(1)} aria-label="Look suivant">→</button>
      </div>

      {mobile ? (
        <>
          <motion.button className="sheet-toggle" onClick={() => setSheetOpen(true)} whileTap={{ scale: 0.97 }}>
            Voir le look · {look.name}
          </motion.button>
          <AnimatePresence>
            {sheetOpen && (
              <>
                <motion.div className="scrim" onClick={() => setSheetOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                <motion.div
                  className="look-sheet"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 36 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.6 }}
                  onDragEnd={(_, info) => info.offset.y > 80 && setSheetOpen(false)}
                >
                  <span className="sheet-grip" />
                  <LookPanel look={look} index={active} activeSlot={activeSlot} setActiveSlot={setActiveSlot} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.aside className="look-panel" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}>
          <LookPanel look={look} index={active} activeSlot={activeSlot} setActiveSlot={setActiveSlot} />
        </motion.aside>
      )}
    </div>
  )
}

function RingFigure({ look, i, pos, R, figH, mobile, isActive, activeSlot, setActiveSlot, onPick }) {
  const off = useTransform(pos, (p) => wrap(i - p))
  const depth = useTransform(off, (o) => 1 - Math.cos(o * STEP)) // 0 devant → 2 au fond
  const x = useTransform(off, (o) => Math.sin(o * STEP) * R)
  const scale = useTransform(depth, (d) => 1 - d * 0.26)
  const y = useTransform(depth, (d) => -d * (mobile ? 18 : 30))
  const opacity = useTransform(depth, (d) => Math.max(0.16, 1 - d * 0.44))
  const filter = useTransform(depth, (d) => `blur(${(d * (mobile ? 2 : 3.4)).toFixed(2)}px)`)
  const zIndex = useTransform(depth, (d) => Math.round(300 - d * 100))
  const hotOpacity = useTransform(off, (o) => Math.max(0, 1 - Math.abs(o) * 6))
  const figW = (figH * 200) / 540

  return (
    <motion.div className="ring-figure" style={{ x, y, scale, opacity, filter, zIndex, width: figW, height: figH, marginLeft: -figW / 2 }}>
      <button className="ring-hit" onClick={onPick} aria-label={`Look ${look.name}`}>
        <LookVisual look={look} className="fill" />
      </button>
      <motion.div className="hotspots" style={{ opacity: hotOpacity, pointerEvents: isActive ? 'auto' : 'none' }}>
        {SLOTS.map((slot) => (
          <button
            key={slot}
            className={`hotspot ${activeSlot === slot && isActive ? 'on' : ''}`}
            style={{ left: `${FIGURE_HOTSPOTS[slot].x}%`, top: `${FIGURE_HOTSPOTS[slot].y}%` }}
            onMouseEnter={() => setActiveSlot(slot)}
            onMouseLeave={() => setActiveSlot(null)}
            onClick={() => setActiveSlot(slot)}
            aria-label={CATEGORY[slot]}
          >
            <span />
            <em className="hotspot-tip">{CATEGORY[slot]}</em>
          </button>
        ))}
      </motion.div>
    </motion.div>
  )
}

function LookPanel({ look, index, activeSlot, setActiveSlot }) {
  const { add } = useBag()
  const [added, setAdded] = useState(false)
  const products = SLOTS.map((s) => ({ slot: s, product: byId(look[s]) }))
  const total = products.reduce((s, p) => s + p.product.price, 0)

  const addAll = () => {
    add(products.map((p) => ({ product: p.product, size: p.slot === 'shoes' ? '42' : 'M' })))
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
                show: { opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: EASE } },
                exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
              }}
              onMouseEnter={() => setActiveSlot(slot)}
              onMouseLeave={() => setActiveSlot(null)}
            >
              <div className="panel-thumb">
                <ProductThumb product={product} />
              </div>
              <div className="panel-info">
                <span className="eyebrow">{CATEGORY[slot]}</span>
                <strong>{product.name}</strong>
                <span>{formatPrice(product.price)}</span>
              </div>
              <button className="icon-btn small" onClick={() => add({ product, size: slot === 'shoes' ? '42' : 'M' })} aria-label={`Ajouter ${product.name}`}>
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
