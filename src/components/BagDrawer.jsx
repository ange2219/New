import { AnimatePresence, motion } from 'framer-motion'
import { useBag } from '../store.jsx'
import { formatPrice } from '../data/catalog.js'
import { ProductThumb } from './Visuals.jsx'

// Petite copie du produit qui vole jusqu'au bouton Panier
function FlyLayer() {
  const { flights, endFlight } = useBag()
  return flights.map((f) => {
    const target = document.querySelector('.bag-count')?.getBoundingClientRect()
    const tx = target ? target.left + target.width / 2 : window.innerWidth - 30
    const ty = target ? target.top + target.height / 2 : 30
    const size = Math.min(f.rect.width, f.rect.height, 260)
    const sx = f.rect.left + f.rect.width / 2
    const sy = f.rect.top + f.rect.height / 2
    return (
      <motion.div
        key={f.id}
        className="flyer"
        style={{ width: size, height: size, left: sx - size / 2, top: sy - size / 2 }}
        initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
        animate={{ x: [0, (tx - sx) * 0.55, tx - sx], y: [0, (ty - sy) * 0.2 - 120, ty - sy], scale: [1, 0.55, 0.08], opacity: [1, 1, 0.4], rotate: [0, -8, 0] }}
        transition={{ duration: 0.9, ease: [0.45, 0, 0.2, 1], times: [0, 0.45, 1] }}
        onAnimationComplete={() => endFlight(f.id)}
      >
        <ProductThumb product={f.product} />
      </motion.div>
    )
  })
}

export default function BagDrawer() {
  const { items, open, setOpen, remove, total } = useBag()
  return (
    <>
    <FlyLayer />
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
          >
            <div className="drawer-head">
              <h2>Panier ({items.length})</h2>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Fermer">✕</button>
            </div>
            <div className="drawer-list">
              {items.length === 0 && <p className="muted">Ton panier est vide.</p>}
              <AnimatePresence initial={false}>
                {items.map((it) => (
                  <motion.div key={it.key} className="drawer-item" layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}>
                    <div className="drawer-thumb">
                      <ProductThumb product={it.product} />
                    </div>
                    <div className="drawer-info">
                      <strong>{it.product.name}</strong>
                      <span className="muted">{it.size ? `Taille ${it.size}` : 'Taille unique'}</span>
                      <span>{formatPrice(it.product.price)}</span>
                    </div>
                    <button className="link-btn" onClick={() => remove(it.key)}>Retirer</button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="drawer-foot">
              <div className="row-between">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <button className="btn-primary" disabled={!items.length}>Commander</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </>
  )
}
