import { motion } from 'framer-motion'
import { BRAND } from '../data/catalog.js'
import { useBag } from '../store.jsx'

export const SCENES = [
  { id: 'home', label: 'Accueil' },
  { id: 'looks', label: 'Cabine' },
  { id: 'rack', label: 'Collection' },
  { id: 'sneakers', label: 'Sneakers' },
]

export default function Header({ scene, onScene }) {
  const { items, setOpen, pulse } = useBag()
  return (
    <header className="header">
      <button className="brand" onClick={() => onScene('home')}>
        {BRAND.name}
      </button>
      <nav className="nav">
        {SCENES.map((s) => (
          <button key={s.id} className={`nav-item ${scene === s.id ? 'active' : ''}`} onClick={() => onScene(s.id)}>
            {s.label}
            {scene === s.id && <motion.span layoutId="nav-underline" className="nav-underline" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
          </button>
        ))}
      </nav>
      <button className="bag-btn" onClick={() => setOpen(true)} aria-label="Ouvrir le panier">
        Panier
        <motion.span key={pulse} className="bag-count" initial={{ scale: pulse ? 1.6 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
          {items.length}
        </motion.span>
      </button>
    </header>
  )
}
