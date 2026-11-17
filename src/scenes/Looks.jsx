import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND, byId, formatPrice, looks } from '../data/catalog.js'
import { LookVisual, ProductThumb } from '../components/Visuals.jsx'
import { FIGURE_HOTSPOTS } from '../components/art/Figure.jsx'
import { useBag } from '../store.jsx'
import { EASE, useKey } from '../hooks.js'

const SLOTS = ['top', 'bottom', 'shoes']
const CATEGORY = { top: 'Haut', bottom: 'Bas', shoes: 'Sneakers' }

export default function Looks() {
  const [selectedId, setSelectedId] = useState(null)
  const [hoverId, setHoverId] = useState(null)
  const selectedIndex = looks.findIndex((l) => l.id === selectedId)
  const selected = looks[selectedIndex]

  const close = useCallback(() => setSelectedId(null), [])
  useKey('Escape', close, !!selected)
  useKey('ArrowRight', () => setSelectedId(looks[(selectedIndex + 1) % looks.length].id), !!selected)
  useKey('ArrowLeft', () => setSelectedId(looks[(selectedIndex - 1 + looks.length) % looks.length].id), !!selected)

  return (
    <div className="scene looks">
      <div className="scene-title">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }}>
              <button className="back-link" onClick={close}>← Tous les looks</button>
              <span className="eyebrow">Look {String(selectedIndex + 1).padStart(2, '0')}</span>
              <h1 className="title-sm">{selected.name}</h1>
            </motion.div>
          ) : (
            <motion.h1 key="title" className="title-sm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              {BRAND.tagline}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Rangée de mannequins */}
      <div className="looks-row" onMouseLeave={() => setHoverId(null)}>
        {looks.map((look, i) => {
          const isSel = look.id === selectedId
          const side = selected ? (i < selectedIndex ? -1 : 1) : 0
          const dim = (hoverId && hoverId !== look.id) || (selected && !isSel)
          return (
            <motion.div
              key={look.id}
              className="look-slot"
              initial={{ opacity: 0, y: 60 }}
              animate={{
                opacity: selected ? 0 : dim ? 0.45 : 1,
                y: 0,
                x: selected ? side * 80 : 0,
                filter: selected ? 'blur(8px)' : 'blur(0px)',
              }}
              transition={{ duration: selected ? 0.5 : 0.7, delay: selected ? 0 : 0.06 * i, ease: EASE }}
              onMouseEnter={() => setHoverId(look.id)}
              style={{ pointerEvents: selected ? 'none' : 'auto', zIndex: hoverId === look.id ? 2 : 1 }}
            >
              {!isSel && (
                <motion.button
                  layoutId={`look-${look.id}`}
                  className="look-figure"
                  onClick={() => setSelectedId(look.id)}
                  whileHover={{ scale: 1.04, y: -6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  aria-label={`Voir le look ${look.name}`}
                >
                  <LookVisual look={look} className="fill" />
                </motion.button>
              )}
              <motion.span className="look-label" animate={{ opacity: hoverId === look.id && !selected ? 1 : 0, y: hoverId === look.id ? 0 : 6 }}>
                {look.name}
              </motion.span>
            </motion.div>
          )
        })}
      </div>

      {/* Mannequin sélectionné + panneau */}
      <AnimatePresence>
        {selected && <LookDetail key="detail" look={selected} index={selectedIndex} onSelect={setSelectedId} />}
      </AnimatePresence>
    </div>
  )
}

function LookDetail({ look, index, onSelect }) {
  const { add } = useBag()
  const [activeSlot, setActiveSlot] = useState(null)
  const [added, setAdded] = useState(false)
  const products = SLOTS.map((s) => ({ slot: s, product: byId(look[s]) }))
  const total = products.reduce((s, p) => s + p.product.price, 0)
  const prev = looks[(index - 1 + looks.length) % looks.length]
  const next = looks[(index + 1) % looks.length]

  const addAll = () => {
    add(products.map((p) => ({ product: p.product, size: p.slot === 'shoes' ? '42' : 'M' })))
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <>
      <div className="look-stage">
        <motion.div key={look.id} layoutId={`look-${look.id}`} className="look-stage-figure" transition={{ type: 'spring', stiffness: 120, damping: 22 }}>
          <LookVisual look={look} className="fill" />
          {SLOTS.map((slot, i) => (
            <motion.button
              key={slot}
              className={`hotspot ${activeSlot === slot ? 'on' : ''}`}
              style={{ left: `${FIGURE_HOTSPOTS[slot].x}%`, top: `${FIGURE_HOTSPOTS[slot].y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.55 + i * 0.12, type: 'spring', stiffness: 400, damping: 20 }}
              onMouseEnter={() => setActiveSlot(slot)}
              onMouseLeave={() => setActiveSlot(null)}
              onClick={() => setActiveSlot(slot)}
              aria-label={CATEGORY[slot]}
            >
              <span />
            </motion.button>
          ))}
        </motion.div>
        <motion.div className="stage-arrows" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }} exit={{ opacity: 0 }}>
          <button className="icon-btn" onClick={() => onSelect(prev.id)} aria-label="Look précédent">←</button>
          <button className="icon-btn" onClick={() => onSelect(next.id)} aria-label="Look suivant">→</button>
        </motion.div>
      </div>

      <motion.aside
        className="look-panel"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 60 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
      >
        <div className="panel-head">
          <span>Dans ce look</span>
          <span className="muted">{products.length} pièces</span>
        </div>
        <AnimatePresence mode="popLayout">
          <motion.ul key={look.id} className="panel-list">
            {products.map(({ slot, product }, i) => (
              <motion.li
                key={product.id}
                className={`panel-item ${activeSlot === slot ? 'on' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.45, ease: EASE }}
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
                <button className="icon-btn small" onClick={() => add({ product, size: slot === 'shoes' ? '42' : 'M' })} aria-label="Ajouter">+</button>
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
      </motion.aside>
    </>
  )
}
