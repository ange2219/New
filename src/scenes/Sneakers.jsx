import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND, SIZES_SHOES, formatPrice, sneakers } from '../data/catalog.js'
import { SneakerVisual } from '../components/Visuals.jsx'
import { useBag } from '../store.jsx'
import { EASE, useKey, useViewport } from '../hooks.js'

export default function Sneakers() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [colorway, setColorway] = useState(0)
  const { w, h } = useViewport()
  const mobile = w < 760
  const n = sneakers.length
  const product = sneakers[active]

  const go = useCallback(
    (d) => {
      setActive((a) => Math.max(0, Math.min(n - 1, a + d)))
      setColorway(0)
    },
    [n],
  )

  useKey('ArrowRight', () => go(1), !open)
  useKey('ArrowLeft', () => go(-1), !open)
  useKey('Escape', () => setOpen(false), open)

  // Molette (avec anti-rebond)
  const stageRef = useRef(null)
  const lock = useRef(0)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      if (open) return
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(d) < 8 || Date.now() - lock.current < 480) return
      lock.current = Date.now()
      go(d > 0 ? 1 : -1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [go, open])

  // Placement en diagonale : la paire active au centre, les suivantes en haut à droite
  const spacingX = mobile ? w * 0.42 : Math.min(360, w * 0.24)
  const spacingY = mobile ? 90 : Math.min(110, h * 0.12)
  const shoeW = mobile ? Math.min(320, w * 0.78) : Math.min(560, w * 0.36)

  const placement = (i) => {
    const d = i - active
    if (open) {
      if (d === 0) {
        return mobile
          ? { x: 0, y: -h * 0.17, scale: 0.95, rotate: -6, opacity: 1 }
          : { x: -w * 0.15, y: -h * 0.03, scale: 1.35, rotate: -8, opacity: 1 }
      }
      return { x: d * spacingX * 2.4, y: -d * spacingY * 2, scale: 0.3, rotate: 0, opacity: 0 }
    }
    const ad = Math.abs(d)
    return {
      x: d * spacingX + (mobile ? 0 : -w * 0.06),
      y: -d * spacingY + (mobile ? -40 : 30),
      scale: d === 0 ? 1 : Math.max(0.26, 0.5 - (ad - 1) * 0.1),
      rotate: d === 0 ? -6 : d * -3,
      opacity: ad > 3 ? 0 : 1 - (ad - 1) * 0.12,
    }
  }

  return (
    <div className="scene sneakers" ref={stageRef}>
      {/* Grand mot en fond */}
      <div className="bigword" aria-hidden="true">
        <motion.div className="bigword-track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, ease: 'linear', repeat: Infinity }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>{BRAND.bigWord}&nbsp;</span>
          ))}
        </motion.div>
      </div>

      {/* Nom du modèle */}
      <motion.div className="sneaker-title" animate={{ opacity: open && !mobile ? 0 : 1 }}>
        <AnimatePresence mode="popLayout">
          <motion.div key={product.id} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <h1 className="title-xl">{product.name}</h1>
            <p className="muted">
              {formatPrice(product.price)} · {product.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
        <span className="counter">
          {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
      </motion.div>

      {/* Carrousel */}
      <motion.div
        className="shoe-field"
        onPanEnd={(_, info) => {
          if (open) return
          if (info.offset.x < -50 || info.offset.y > 60) go(1)
          else if (info.offset.x > 50 || info.offset.y < -60) go(-1)
        }}
      >
        {sneakers.map((s, i) => {
          const d = i - active
          const pl = placement(i)
          const isActive = d === 0
          return (
            <motion.div
              key={s.id}
              className="shoe"
              style={{ width: shoeW, marginLeft: -shoeW / 2, marginTop: -shoeW * 0.275, zIndex: 100 - Math.abs(d), pointerEvents: pl.opacity === 0 ? 'none' : 'auto' }}
              initial={{ opacity: 0, x: pl.x + 300, y: pl.y - 200, scale: pl.scale * 0.6 }}
              animate={{ ...pl, filter: Math.abs(d) >= 2 && !open ? 'blur(1.5px)' : 'blur(0px)' }}
              transition={{ type: 'spring', stiffness: 70, damping: 16, mass: 1 }}
              onClick={() => {
                if (open) return
                if (isActive) setOpen(true)
                else {
                  setActive(i)
                  setColorway(0)
                }
              }}
            >
              <motion.div
                animate={{ y: [0, -14, 0], rotate: [0, 1.2, 0] }}
                transition={{ duration: 3.4 + (i % 3) * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                whileHover={!open ? { scale: 1.06 } : undefined}
                className="shoe-inner"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={isActive && !s.model ? colorway : 0}
                    initial={{ opacity: 0, rotateY: 50, x: 30 }}
                    animate={{ opacity: 1, rotateY: 0, x: 0 }}
                    exit={{ opacity: 0, rotateY: -50, x: -30 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <SneakerVisual product={s} colorwayIndex={isActive ? colorway : 0} className="fill" allow3D={Math.abs(d) <= 2} interactive={open && isActive} autoRotate={open && isActive} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              <motion.div className="shoe-shadow" animate={{ scaleX: [1, 0.82, 1], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 3.4 + (i % 3) * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }} />
            </motion.div>
          )
        })}
      </motion.div>

      {/* Barre de progression */}
      <motion.div className="slider" animate={{ opacity: open ? 0 : 1 }}>
        <div className="slider-track">
          {sneakers.map((s, i) => (
            <button key={s.id} className="slider-hit" onClick={() => setActive(i)} aria-label={s.name} />
          ))}
          <motion.span className="slider-thumb" animate={{ left: `${(active / (n - 1)) * 100}%` }} transition={{ type: 'spring', stiffness: 260, damping: 30 }} />
        </div>
        <span className="hint">Molette, flèches ou glisser · clique pour ouvrir</span>
      </motion.div>

      <AnimatePresence>
        {open && <SneakerPanel key={product.id} product={product} colorway={colorway} setColorway={setColorway} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}

function SneakerPanel({ product, colorway, setColorway, onClose }) {
  const { add } = useBag()
  const [size, setSize] = useState(null)
  const [state, setState] = useState('idle')

  const addToBag = () => {
    if (!size) return setState('missing')
    add({ product, size })
    setState('added')
  }

  return (
    <>
      <motion.button className="back-link detail-back" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        ← Toutes les chaussures
      </motion.button>

      <motion.div className="colorways" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ delay: 0.4, duration: 0.4 }}>
        {product.colorways.map((cw, i) =>
          product.model ? (
            <button key={i} className={`cw cw-label ${i === colorway ? 'on' : ''}`} onClick={() => setColorway(i)}>
              <span className="cw-dot" style={{ background: `linear-gradient(135deg, ${cw.upper} 50%, ${cw.panel} 50%)` }} />
              {cw.label}
            </button>
          ) : (
            <button key={i} className={`cw ${i === colorway ? 'on' : ''}`} onClick={() => setColorway(i)} aria-label={`Coloris ${i + 1}`}>
              <SneakerVisual product={product} colorwayIndex={i} className="fill" />
            </button>
          ),
        )}
      </motion.div>

      <motion.aside className="detail-info sneaker-info" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}>
        <span className="eyebrow">Chaussures</span>
        <h2 className="title-md">{product.name}</h2>
        <p className="muted">{product.subtitle}</p>
        <p className="price">{formatPrice(product.price)}</p>

        <div className="field">
          <span className="field-label">
            Pointure (EU) {state === 'missing' && <em className="warn">— choisis ta pointure</em>}
          </span>
          <motion.div className="sizes shoes" animate={state === 'missing' ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
            {SIZES_SHOES.map((s, i) => (
              <motion.button
                key={s}
                className={`size ${size === s ? 'on' : ''} ${i % 5 === 3 ? 'out' : ''}`}
                disabled={i % 5 === 3}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.025 }}
                onClick={() => {
                  setSize(s)
                  setState('idle')
                }}
              >
                {s}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <motion.button className={`btn-primary ${state === 'added' ? 'red' : ''}`} onClick={addToBag} whileTap={{ scale: 0.97 }} layout>
          {state === 'added' ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
        </motion.button>
        <p className="muted small">Livraison offerte dès 100 € · Retours gratuits 30 jours</p>
        {product.model && <p className="muted small credit">Glisse sur la chaussure pour la faire tourner, pince pour zoomer. {product.credit}</p>}
      </motion.aside>
    </>
  )
}
