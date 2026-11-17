import { useCallback, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ACC_PLURAL, ACC_TYPES, SIZES_RINGS, accessories, formatPrice, looks } from '../data/catalog.js'
import { AccessoryVisual, LookVisual } from '../components/Visuals.jsx'
import { useBag } from '../store.jsx'
import { EASE, useKey } from '../hooks.js'

const FILTERS = [{ id: 'all', label: 'Tout' }, ...Object.keys(ACC_PLURAL).map((id) => ({ id, label: ACC_PLURAL[id] }))]

export default function Accessories({ onNavigate }) {
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const list = filter === 'all' ? accessories : accessories.filter((a) => a.type === filter)
  const selected = accessories.find((a) => a.id === selectedId)
  const close = useCallback(() => setSelectedId(null), [])
  useKey('Escape', close, !!selected)

  return (
    <div className="scene acc-scene">
      <motion.div className="acc-scroll" animate={{ opacity: selected ? 0 : 1, scale: selected ? 0.97 : 1, filter: selected ? 'blur(6px)' : 'blur(0px)' }} transition={{ duration: 0.5, ease: EASE }} style={{ pointerEvents: selected ? 'none' : 'auto' }}>
        <div className="acc-head">
          <div>
            <span className="eyebrow">{accessories.length} pièces</span>
            <h1 className="section-title">Accessoires</h1>
            <p className="muted">Lunettes, casquettes, chaînes, montres, bracelets et bagues. Pour finir le look.</p>
          </div>
          <div className="chips" role="tablist">
            {FILTERS.map((f) => (
              <button key={f.id} role="tab" aria-selected={filter === f.id} className={`chip ${filter === f.id ? 'on' : ''}`} onClick={() => setFilter(f.id)}>
                {filter === f.id && <motion.span layoutId="chip-bg" className="chip-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="chip-label">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div className="acc-grid" layout>
          <AnimatePresence mode="popLayout">
            {list.map((a, i) => (
              <AccCard key={a.id} a={a} i={i} hidden={selectedId === a.id} onOpen={() => setSelectedId(a.id)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <AnimatePresence>{selected && <AccDetail key="d" a={selected} onClose={close} onNavigate={onNavigate} />}</AnimatePresence>
    </div>
  )
}

function AccCard({ a, i, hidden, onOpen }) {
  // Inclinaison 3D qui suit la souris
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 200, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), { stiffness: 200, damping: 18 })

  return (
    <motion.button
      layout
      className="acc-card"
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 8) * 0.04 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      onClick={onOpen}
    >
      <div className="acc-stage">
        {!hidden && (
          <motion.div layoutId={`acc-${a.id}`} className="acc-visual" style={{ rotateX: rx, rotateY: ry }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
            <motion.div className="fill" animate={{ y: [0, -6, 0] }} transition={{ duration: 3.4 + (i % 4) * 0.4, repeat: Infinity, ease: 'easeInOut' }}>
              <AccessoryVisual product={a} className="fill" />
            </motion.div>
          </motion.div>
        )}
      </div>
      <div className="acc-info">
        <span className="eyebrow">{ACC_TYPES[a.type]}</span>
        <strong>{a.name}</strong>
        <span className="muted">{a.subtitle}</span>
        <span className="acc-price">{formatPrice(a.price)}</span>
      </div>
    </motion.button>
  )
}

function AccDetail({ a, onClose, onNavigate }) {
  const { add } = useBag()
  const isRing = a.type === 'ring'
  const [size, setSize] = useState(null)
  const [state, setState] = useState('idle')
  const wornIn = looks.filter((l) => (l.acc || []).includes(a.id))

  // Glisser pour faire pivoter
  const rot = useMotionValue(0)
  const rotY = useSpring(rot, { stiffness: 120, damping: 16 })

  const addToBag = () => {
    if (isRing && !size) return setState('missing')
    add({ product: a, size: isRing ? size : null })
    setState('added')
  }

  return (
    <div className="detail acc-detail">
      <button className="back-link detail-back" onClick={onClose}>← Tous les accessoires</button>
      <div className="detail-stage">
        <motion.div
          layoutId={`acc-${a.id}`}
          className="acc-big"
          style={{ rotateY: rotY }}
          transition={{ type: 'spring', stiffness: 110, damping: 20 }}
          onPan={(_, info) => rot.set(Math.max(-40, Math.min(40, info.offset.x * 0.25)))}
          onPanEnd={() => rot.set(0)}
        >
          <motion.div className="fill" animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <AccessoryVisual product={a} className="fill" />
          </motion.div>
        </motion.div>
        <motion.div className="floor-shadow" initial={{ opacity: 0, scaleX: 0.4 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.4 }} />
      </div>

      <motion.aside className="detail-info" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
        <span className="eyebrow">{ACC_TYPES[a.type]}</span>
        <h2 className="title-md">{a.name}</h2>
        <p className="muted">{a.subtitle}</p>
        <p className="price">{formatPrice(a.price)}</p>

        {isRing && (
          <div className="field">
            <span className="field-label">
              Taille de doigt {state === 'missing' && <em className="warn">— choisis ta taille</em>}
            </span>
            <motion.div className="sizes rings" animate={state === 'missing' ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
              {SIZES_RINGS.map((s) => (
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
        )}

        <motion.button className={`btn-primary ${state === 'added' ? 'red' : ''}`} onClick={addToBag} whileTap={{ scale: 0.97 }}>
          {state === 'added' ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
        </motion.button>

        {wornIn.length > 0 && (
          <div className="worn-in">
            <span className="field-label">Porté dans la cabine</span>
            <div className="worn-list">
              {wornIn.map((l) => (
                <button key={l.id} className="worn-item" onClick={() => onNavigate?.('looks')}>
                  <span className="worn-fig">
                    <LookVisual look={l} className="fill" />
                  </span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.aside>
    </div>
  )
}
