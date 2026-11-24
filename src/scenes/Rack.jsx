import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import { SIZES_CLOTHES, TOP_TYPES, formatPrice, tops } from '../data/catalog.js'
import { GarmentVisual } from '../components/Visuals.jsx'
import { useBag } from '../store.jsx'
import { EASE, useKey, useViewport } from '../hooks.js'

// Le portant est rempli comme en boutique : chaque pièce apparaît deux fois
const RACK = [...tops, ...tops].map((p, i) => ({ p, key: `${p.id}-${i}` }))
const PROFILE = -72 // angle de la pièce vue de profil (en degrés)

export default function Rack() {
  const [selectedKey, setSelectedKey] = useState(null)
  const [hover, setHover] = useState(null)
  const selected = RACK.find((r) => r.key === selectedKey)
  const { w, h } = useViewport()
  const mobile = w < 760

  // Mesures : vêtements serrés, de profil
  const garmentH = mobile ? Math.min(h * 0.34, 240) : Math.min(h * 0.4, 330)
  const garmentW = garmentH * 0.92
  const spacing = mobile ? garmentW * 0.46 : garmentW * 0.4
  const hookH = garmentH * 0.16

  // Défilement horizontal : glisser ou molette
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const x = useMotionValue(0)
  const [bounds, setBounds] = useState({ left: 0, right: 0 })
  const dragged = useRef(false)

  useEffect(() => {
    const vw = viewportRef.current?.offsetWidth || w
    const tw = trackRef.current?.scrollWidth || 0
    setBounds({ left: Math.min(0, vw - tw), right: 0 })
  }, [w, spacing])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e) => {
      if (selectedKey) return
      e.preventDefault()
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      const next = Math.max(bounds.left, Math.min(bounds.right, x.get() - d * 0.8))
      animate(x, next, { type: 'spring', stiffness: 160, damping: 32 })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [bounds, selectedKey, x])

  const progress = useTransform(x, (v) => (bounds.left ? v / bounds.left : 0))
  const close = useCallback(() => setSelectedKey(null), [])
  useKey('Escape', close, !!selected)

  const goEnd = () => animate(x, bounds.left, { duration: 2.4, ease: [0.65, 0, 0.35, 1] })

  return (
    <div className="scene rack">
      <motion.div className="rack-head" animate={{ opacity: selected ? 0 : 1, y: selected ? -10 : 0 }}>
        <span className="rack-kicker">Nouvelle collection</span>
        <span className="rack-sep" />
        <span className="rack-kicker muted">Streetwear premium</span>
      </motion.div>

      <motion.div
        className="rack-viewport"
        ref={viewportRef}
        style={{ top: mobile ? '22vh' : '24vh', pointerEvents: selected ? 'none' : 'auto' }}
        animate={{ opacity: selected ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          ref={trackRef}
          className="rack-track"
          style={{ x, paddingLeft: spacing * 1.4, paddingRight: spacing * 1.4 }}
          drag="x"
          dragConstraints={bounds}
          dragElastic={0.06}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={() => setTimeout(() => (dragged.current = false), 60)}
          onMouseLeave={() => setHover(null)}
        >
          <div className="rail">
            <span className="rail-end left" />
            <span className="rail-end right" />
          </div>
          {RACK.map(({ p, key }, i) => (
            <RackItem
              key={key}
              rkey={key}
              p={p}
              i={i}
              hover={hover}
              setHover={setHover}
              mobile={mobile}
              spacing={spacing}
              garmentW={garmentW}
              garmentH={garmentH}
              hookH={hookH}
              hidden={selectedKey === key}
              onOpen={() => !dragged.current && setSelectedKey(key)}
            />
          ))}
        </motion.div>
      </motion.div>

      <motion.div className="rack-foot" animate={{ opacity: selected ? 0 : 1 }}>
        <div className="rack-count">
          <span>{tops.length} pièces</span>
          <div className="rack-progress">
            <motion.span style={{ scaleX: progress }} />
          </div>
        </div>
        <div className="rack-copy">
          <p>
            Coton lourd, coupes amples.
            <br />
            Faits pour durer.
          </p>
          <button className="link-arrow" onClick={goEnd}>
            Parcourir le portant <span>→</span>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>{selected && <GarmentDetail key="d" rkey={selected.key} product={selected.p} onClose={close} />}</AnimatePresence>
    </div>
  )
}

function RackItem({ p, rkey, i, hover, setHover, mobile, spacing, garmentW, garmentH, hookH, hidden, onOpen }) {
  const isHover = hover === i
  // les voisins s'écartent pour laisser la pièce se tourner de face
  const d = hover == null ? 0 : i - hover
  const room = (garmentW - spacing) / 2 + 6
  const shift = d === 0 || Math.abs(d) > 4 ? 0 : Math.sign(d) * room * (1 - (Math.abs(d) - 1) * 0.22)

  return (
    <div className="rack-slot" style={{ width: spacing, height: hookH + garmentH + 20, zIndex: isHover ? 60 : 10 + (i % 2) }}>
      {/* tout le cintre (crochet + pièce) glisse ensemble le long de la tringle */}
      <motion.div
        className="rack-hang"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: hidden ? 0 : 1, x: shift }}
        transition={{
          y: { type: 'spring', stiffness: 120, damping: 12, delay: 0.03 * i },
          opacity: { duration: 0.3, delay: hidden ? 0 : 0.03 * i },
          x: { type: 'spring', stiffness: 220, damping: 26 },
        }}
      >
        {/* crochet métallique, accroché par-dessus la tringle */}
        <svg className="rack-hook" viewBox="0 0 20 40" style={{ height: hookH + garmentH * 0.03 }} preserveAspectRatio="xMidYMin meet" aria-hidden="true">
          <defs>
            <linearGradient id="hookMetal" x1="0" x2="1">
              <stop offset="0" stopColor="#6f6d69" />
              <stop offset=".45" stopColor="#e9e8e5" />
              <stop offset="1" stopColor="#7d7b77" />
            </linearGradient>
          </defs>
          <path d="M10 40 L10 20 C10 13 16.5 13 16.5 8 C16.5 2.5 11 1.5 8.5 4.5" fill="none" stroke="url(#hookMetal)" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <button
          className="rack-piece"
          style={{ width: spacing, height: garmentH, left: 0, top: hookH }}
          onMouseEnter={() => !mobile && setHover(i)}
          onFocus={() => setHover(i)}
          onClick={onOpen}
          aria-label={`${p.name} — ${formatPrice(p.price)}`}
        >
          <div className="rack-visual" style={{ width: garmentW, marginLeft: -garmentW / 2 }}>
            <motion.div
              className="rack-turn"
              initial={{ rotateY: PROFILE }}
              animate={{ rotateY: isHover ? 0 : PROFILE, rotateZ: isHover ? 0 : 1.5 }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            >
              {/* cintre en bois, glissé dans l'encolure sous les épaules ; il tourne avec la pièce */}
              <RackHanger />
              {!hidden && (
                <motion.div
                  layoutId={`garment-${rkey}`}
                  className="rack-img"
                  animate={{ filter: isHover ? 'brightness(1) drop-shadow(0 14px 14px rgba(0,0,0,.16))' : 'brightness(0.82) drop-shadow(0 8px 8px rgba(0,0,0,.1))' }}
                  transition={{ type: 'spring', stiffness: 110, damping: 20 }}
                >
                  <GarmentVisual product={p} className="fill" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* étiquette de prix */}
          <motion.span
            className="price-tag"
            style={{ top: -hookH * 0.25 }}
            animate={{ rotate: isHover ? [0, 10, -6, 3, 0] : -4 }}
            transition={{ duration: 0.9 }}
          >
            {formatPrice(p.price).replace(',00', '')}
          </motion.span>
        </button>
      </motion.div>
    </div>
  )
}

function RackHanger() {
  return (
    <svg className="rack-hanger" viewBox="0 0 200 44" aria-hidden="true">
      <defs>
        <linearGradient id="rackWood" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#9a6a43" />
          <stop offset=".55" stopColor="#7a4f2f" />
          <stop offset="1" stopColor="#4f321c" />
        </linearGradient>
      </defs>
      <rect x="97.5" y="0" width="5" height="12" rx="2" fill="#bdbbb6" />
      <path d="M100 9 C72 13 28 27 7 35 C2 37 3 43 10 42 L190 42 C197 43 198 37 193 35 C172 27 128 13 100 9 Z" fill="url(#rackWood)" />
      <path d="M12 40 L188 40" stroke="#3b2414" strokeOpacity=".4" strokeWidth="1.5" />
      <path d="M100 11 C75 15 40 26 20 33" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ── Fiche produit : cintre en bois, rotation face / profil / dos ──
function GarmentDetail({ product, rkey, onClose }) {
  const { add, fly } = useBag()
  const [size, setSize] = useState(null)
  const [state, setState] = useState('idle') // idle | missing | added
  const [side, setSide] = useState('front')
  const [more, setMore] = useState(false)
  const rotY = useMotionValue(0)
  const startRot = useRef(0)
  const pieceRef = useRef(null)

  const spin = (to) => animate(rotY, to, { duration: 1.5, ease: [0.65, 0, 0.35, 1] })

  useMotionValueEvent(rotY, 'change', (v) => {
    const a = ((v % 360) + 360) % 360
    setSide(a > 90 && a < 270 ? 'back' : 'front')
  })

  useEffect(() => {
    // à l'ouverture : la pièce fait un tour complet (face → profil → dos → face)
    const t = setTimeout(() => spin(360), 750)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const face = (deg) => {
    const cur = rotY.get()
    let target = Math.round(cur / 360) * 360 + deg
    if (Math.abs(target - cur) > 180) target += target > cur ? -360 : 360
    spin(target)
  }

  const addToBag = () => {
    if (!size) return setState('missing')
    add({ product, size })
    setState('added')
    const rect = pieceRef.current?.getBoundingClientRect()
    if (rect) fly(product, rect, { openAfter: true })
    setTimeout(() => setState('idle'), 2200)
  }

  const layers = [-4, -2, 0, 2, 4]

  return (
    <div className="detail rack-detail">
      <motion.button className="close-btn" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        Fermer <span>✕</span>
      </motion.button>

      <div className="rd-stage">
        <motion.div className="rd-wire" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} exit={{ scaleY: 0 }} transition={{ duration: 0.6, ease: EASE }} />
        <motion.div layoutId={`garment-${rkey}`} className="rd-piece" ref={pieceRef} transition={{ type: 'spring', stiffness: 100, damping: 20 }}>
          <motion.div
            className="spinner"
            style={{ rotateY: rotY }}
            onPanStart={() => {
              rotY.stop()
              startRot.current = rotY.get()
            }}
            onPan={(_, info) => rotY.set(startRot.current + info.offset.x * 0.6)}
          >
            <WoodHanger />
            {layers.map((z) => (
              <div key={z} className="face" style={{ transform: `translateZ(${z}px)`, filter: 'brightness(0.7)' }}>
                <GarmentVisual product={product} className="fill" />
              </div>
            ))}
            <div className="face front" style={{ transform: 'translateZ(6px)' }}>
              <GarmentVisual product={product} className="fill" />
            </div>
            <div className="face back" style={{ transform: 'rotateY(180deg) translateZ(6px)' }}>
              <GarmentVisual product={product} side="back" className="fill" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.aside className="rd-info" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}>
        <span className="eyebrow">{TOP_TYPES[product.type]}</span>
        <h2 className="rd-name">{product.name}</h2>
        <p className="rd-price">{formatPrice(product.price)}</p>

        <div className="rd-tabs" role="tablist">
          {[
            ['front', 'Face', 0],
            ['back', 'Dos', 180],
          ].map(([id, label, deg]) => (
            <button key={id} role="tab" aria-selected={side === id} className={side === id ? 'on' : ''} onClick={() => face(deg)}>
              {label}
              {side === id && <motion.span layoutId="rd-tab-line" className="rd-tab-line" />}
            </button>
          ))}
        </div>

        <span className="field-label">
          Taille {state === 'missing' && <em className="warn">— choisis ta taille</em>}
        </span>
        <motion.div className="rd-sizes" animate={state === 'missing' ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
          {SIZES_CLOTHES.map((s) => (
            <button
              key={s}
              className={`rd-size ${size === s ? 'on' : ''}`}
              onClick={() => {
                setSize(s)
                setState('idle')
              }}
            >
              {s}
            </button>
          ))}
        </motion.div>

        <motion.button className={`btn-primary rd-add ${state === 'added' ? 'done' : ''}`} onClick={addToBag} whileTap={{ scale: 0.97 }}>
          {state === 'added' ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
        </motion.button>

        <div className="rd-foot">
          <span className="muted">{product.subtitle}</span>
          <button className="link-arrow" onClick={() => setMore((m) => !m)}>
            {more ? 'Masquer' : 'Détails'} <span>→</span>
          </button>
        </div>
        <AnimatePresence>
          {more && (
            <motion.p className="muted small rd-more" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              Coupe ample · Matière épaisse · Livraison offerte dès 100 € · Retours gratuits sous 30 jours. Glisse sur la pièce pour la faire tourner.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.aside>
    </div>
  )
}

function WoodHanger() {
  return (
    <svg className="wood-hanger" viewBox="0 0 220 70" aria-hidden="true">
      <defs>
        <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8a5a36" />
          <stop offset="1" stopColor="#5c3a20" />
        </linearGradient>
      </defs>
      <path d="M110 4 C110 -2 118 -2 118 4 C118 9 110 10 110 16" fill="none" stroke="#9b9b9b" strokeWidth="3" strokeLinecap="round" />
      <path d="M110 16 C80 22 30 40 8 56 C4 59 6 64 12 63 L208 63 C214 64 216 59 212 56 C190 40 140 22 110 16 Z" fill="url(#wood)" />
      <path d="M14 60 L206 60" stroke="#3d2614" strokeOpacity=".35" strokeWidth="1.5" />
    </svg>
  )
}
