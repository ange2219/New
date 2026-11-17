import { AnimatePresence, motion } from 'framer-motion'
import { useBag } from '../store.jsx'
import { formatPrice } from '../data/catalog.js'
import { ProductThumb } from './Visuals.jsx'

export default function BagDrawer() {
  const { items, open, setOpen, remove, total } = useBag()
  return (
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
  )
}
