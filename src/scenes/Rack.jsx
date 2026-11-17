import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { SIZES_CLOTHES, colorOptions, formatPrice, tops } from '../data/catalog.js'
import { GarmentVisual } from '../components/Visuals.jsx'
import { useBag } from '../store.jsx'
import { EASE, useKey, useViewport } from '../hooks.js'

const TYPE_LABEL = { hoodie: 'Hoodie', crewneck: 'Sweat col rond', tee: 'T-shirt', jacket: 'Veste' }

export default function Rack() {
  const [selectedId, setSelectedId] = useState(null)
  const selected = tops.find((t) => t.id === selectedId)
  const { w, h } = useViewport()
  const itemW = w < 700 ? 150 : Math.max(170, Math.min(260, h * 0.3))
  const gap = w < 700 ? 6 : 10

  // Défilement horizontal : glisser ou molette
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const x = useMotionValue(0)
  const [bounds, setBounds] = useState({ left: 0, right: 0 })
  const dragged = useRef(false)

  useEffect(() => {
    const vw = viewportRef.current?.offsetWidth || w
    const tw = trackRef.current?.scrollWidth || 0
    setBounds({ left: Math.min(0, vw - tw - 40), right: 0 })
  }, [w, itemW])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e) => {
      if (selectedId) return
      e.preventDefault()
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      const next = Math.max(bounds.left, Math.min(bounds.right, x.get() - d))
      animate(x, next, { type: 'spring', stiffness: 300, damping: 40 })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [bounds, selectedId, x])

  const progress = useTransform(x, (v) => (bounds.left ? v / bounds.left : 0))
  const close = useCallback(() => setSelectedId(null), [])
  useKey('Escape', close, !!selected)

  return (
    <div className="scene rack">
      <div className="scene-title">
        <motion.div animate={{ opacity: selected ? 0 : 1, y: selected ? -10 : 0 }}>
          <span className="eyebrow">Automne / Hiver 26</span>
          <h1 className="title-sm">Collection</h1>
          <span className="muted">{tops.length} pièces — glisse pour parcourir</span>
        </motion.div>
      </div>

      <motion.div className="rack-viewport" ref={viewportRef} animate={{ opacity: selected ? 0 : 1 }} transition={{ duration: 0.4 }} style={{ pointerEvents: selected ? 'none' : 'auto' }}>
        <motion.div
          ref={trackRef}
          className="rack-track"
          style={{ x, gap }}
          drag="x"
          dragConstraints={bounds}
          dragElastic={0.08}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={() => setTimeout(() => (dragged.current = false), 50)}
        >
          <div className="rail" />
          {tops.map((p, i) => (
            <motion.div
              key={p.id}
              className="hanger-item"
              style={{ width: itemW }}
              initial={{ x: 400, opacity: 0, rotate: -8 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.04 * i, x: { type: 'spring', stiffness: 90, damping: 16 }, rotate: { type: 'spring', stiffness: 120, damping: 6 } }}
            >
              <motion.button
                className="hanger-swing"
                whileHover={{ rotate: [0, 5, -4, 2.5, -1, 0], y: -8, transition: { duration: 1.1 } }}
                onClick={() => !dragged.current && setSelectedId(p.id)}
                aria-label={`${p.name} ${TYPE_LABEL[p.type]}`}
              >
                <Hanger />
                {selectedId !== p.id ? (
                  <motion.div layoutId={`garment-${p.id}`} className="hanger-garment" transition={{ type: 'spring', stiffness: 110, damping: 20 }}>
                    <GarmentVisual product={p} className="fill" />
                  </motion.div>
                ) : (
                  <div className="hanger-garment" />
                )}
                <span className="hanger-tag">
                  {p.name}
                  <em>{formatPrice(p.price)}</em>
                </span>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div className="rack-progress" animate={{ opacity: selected ? 0 : 1 }}>
        <motion.span style={{ scaleX: progress }} />
      </motion.div>

      <AnimatePresence>{selected && <GarmentDetail key="d" product={selected} onClose={close} />}</AnimatePresence>
    </div>
  )
}

function Hanger() {
  return (
    <svg className="hanger" viewBox="0 0 120 50" aria-hidden="true">
      <path d="M60 22 C60 14 66 12 66 6 C66 1 58 -1 55 4" fill="none" stroke="#9a9a9a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 22 L8 46 L112 46 Z" fill="none" stroke="#b9b9b9" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}

// ── Fiche produit avec rotation 360° ─────────────────────────
function GarmentDetail({ product, onClose }) {
  const { add } = useBag()
  const [color, setColor] = useState(product.color)
  const [size, setSize] = useState(null)
  const [state, setState] = useState('idle') // idle | missing | added
  const rotY = useMotionValue(0)
  const startRot = useRef(0)

  const spin = (to) => animate(rotY, to, { duration: 1.6, ease: [0.65, 0, 0.35, 1] })

  useEffect(() => {
    // Un tour complet à l'ouverture, une fois que le vêtement est arrivé au centre
    const t = setTimeout(() => spin(360), 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const face = (deg) => {
    const cur = rotY.get()
    const base = Math.round(cur / 360) * 360
    let target = base + deg
    if (Math.abs(target - cur) > 180) target += target > cur ? -360 : 360
    spin(target)
  }

  const addToBag = () => {
    if (!size) {
      setState('missing')
      return
    }
    add({ product: { ...product, color }, size })
    setState('added')
    setTimeout(() => setState('idle'), 1800)
  }

  const p = { ...product, color }
  const layers = [-5, -3, -1, 1, 3, 5]

  return (
    <div className="detail">
      <button className="back-link detail-back" onClick={onClose}>← Retour au portant</button>

      <div className="detail-stage">
        <motion.div layoutId={`garment-${product.id}`} className="garment-big" transition={{ type: 'spring', stiffness: 110, damping: 20 }}>
          <motion.div
            className="spinner"
            style={{ rotateY: rotY }}
            onPanStart={() => {
              rotY.stop()
              startRot.current = rotY.get()
            }}
            onPan={(_, info) => rotY.set(startRot.current + info.offset.x * 0.6)}
          >
            {layers.map((z) => (
              <div key={z} className="face" style={{ transform: `translateZ(${z}px)`, filter: 'brightness(0.72)' }}>
                <GarmentVisual product={p} className="fill" />
              </div>
            ))}
            <div className="face front" style={{ transform: 'translateZ(7px)' }}>
              <GarmentVisual product={p} className="fill" />
            </div>
            <div className="face back" style={{ transform: 'rotateY(180deg) translateZ(7px)' }}>
              <GarmentVisual product={p} side="back" className="fill" />
            </div>
          </motion.div>
        </motion.div>
        <motion.div className="floor-shadow" initial={{ opacity: 0, scaleX: 0.4 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.4 }} />
        <motion.div className="view-switch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <button onClick={() => face(0)}>Face</button>
          <button onClick={() => face(180)}>Dos</button>
          <button onClick={() => spin(rotY.get() + 360)}>360°</button>
        </motion.div>
        <motion.p className="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          Glisse pour faire tourner
        </motion.p>
      </div>

      <motion.aside className="detail-info" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
        <span className="eyebrow">{TYPE_LABEL[product.type]}</span>
        <h2 className="title-md">{product.name}</h2>
        <p className="price">{formatPrice(product.price)}</p>

        <div className="field">
          <span className="field-label">Couleur</span>
          <div className="swatches">
            {[product.color, ...colorOptions.filter((c) => c !== product.color)].slice(0, 6).map((c) => (
              <button key={c} className={`swatch ${c === color ? 'on' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={`Couleur ${c}`} />
            ))}
          </div>
        </div>

        <div className="field">
          <span className="field-label">
            Taille {state === 'missing' && <em className="warn">— choisis ta taille</em>}
          </span>
          <motion.div className="sizes" animate={state === 'missing' ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
            {SIZES_CLOTHES.map((s) => (
              <button
                key={s}
                className={`size ${size === s ? 'on' : ''}`}
                onClick={() => {
                  setSize(s)
                  setState('idle')
                }}
              >
                {s}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.button className={`btn-primary ${state === 'added' ? 'done' : ''}`} onClick={addToBag} whileTap={{ scale: 0.97 }}>
          {state === 'added' ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
        </motion.button>
        <p className="muted small">Coton brossé 480 g/m² · Coupe oversize · Livraison offerte dès 100 €</p>
      </motion.aside>
    </div>
  )
}
