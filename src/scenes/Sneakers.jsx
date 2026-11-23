import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND, SIZES_SHOES, formatPrice, sneakers } from '../data/catalog.js'
import { SneakerVisual } from '../components/Visuals.jsx'
import { useBag } from '../store.jsx'
import { EASE, useKey, useViewport } from '../hooks.js'

const N = sneakers.length
const QUICK_SIZES = ['40', '41', '42', '43', '44', '45', '46']
const SPRING = { type: 'spring', stiffness: 70, damping: 17, mass: 1 }

// Taille selon la distance au centre de la courbe
const SCALES = [1, 0.6, 0.42, 0.3, 0.22]

export default function Sneakers() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [colorway, setColorway] = useState(0)
  const [presetSize, setPresetSize] = useState(null)
  const { w } = useViewport()
  const mobile = w < 760

  // Taille réelle de la scène (sous l'en-tête)
  const sceneRef = useRef(null)
  const [box, setBox] = useState({ w: w, h: 700 })
  useLayoutEffect(() => {
    const el = sceneRef.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const go = useCallback(
    (d) => {
      setActive((a) => Math.max(0, Math.min(N - 1, a + d)))
      setColorway(0)
    },
    [],
  )
  const select = (i) => {
    setActive(i)
    setColorway(0)
  }

  useKey('ArrowRight', () => go(1), !open)
  useKey('ArrowLeft', () => go(-1), !open)
  useKey('Escape', () => setOpen(false), open)

  // Molette : un cran = une paire
  const lock = useRef(0)
  useEffect(() => {
    const el = sceneRef.current
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

  // ── Géométrie : les paires suivent une courbe (bas-gauche → haut-droite) ──
  const shoeW = mobile ? Math.min(box.w * 0.56, 260) : Math.min(box.w * 0.21, 330)
  const shoeH = shoeW * 0.62
  const cx = mobile ? box.w * 0.5 : box.w * 0.5
  const cy = mobile ? box.h * 0.42 : box.h * 0.5
  const sx = mobile ? shoeW * 0.62 : shoeW * 0.92
  const sy = mobile ? shoeW * 0.42 : shoeW * 0.5

  const pointAt = useCallback(
    (d) => {
      const a = Math.abs(d)
      // courbe douce : on remonte vite à droite, on s'aplatit au loin
      const x = cx + d * sx * (1 - a * 0.06)
      const y = cy - d * sy * (1 - a * 0.12) + (d < 0 ? a * sy * 0.05 : 0)
      return { x, y }
    },
    [cx, cy, sx, sy],
  )

  const detailW = mobile ? Math.min(box.w * 0.82, 340) : Math.min(box.w * 0.4, 560)

  const placement = (i) => {
    const d = i - active
    const a = Math.abs(d)
    if (open) {
      if (d === 0) {
        return mobile
          ? { x: box.w * 0.5, y: box.h * 0.24, scale: detailW / shoeW, rotate: -4, opacity: 1 }
          : { x: box.w * 0.33, y: box.h * 0.45, scale: detailW / shoeW, rotate: -4, opacity: 1 }
      }
      const p = pointAt(d * 1.6)
      return { x: p.x, y: p.y, scale: 0.2, rotate: 0, opacity: 0 }
    }
    const p = pointAt(d)
    return {
      x: p.x,
      y: p.y,
      scale: SCALES[Math.min(a, SCALES.length - 1)],
      rotate: d === 0 ? -4 : d * -2,
      opacity: a > 4 ? 0 : 1,
    }
  }

  // Fil très fin qui relie les paires (courbe lissée)
  const threadPath = useMemo(() => {
    const pts = [-3, -2, -1, 0, 1, 2, 3].map((d) => {
      const p = pointAt(d)
      return { x: p.x, y: p.y + shoeH * 0.5 * SCALES[Math.min(Math.abs(d), SCALES.length - 1)] }
    })
    let path = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[i + 2] || p2
      const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
      const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
      path += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }
    return path
  }, [pointAt, shoeH])

  const product = sneakers[active]

  // Règle de défilement (glisser)
  const rulerRef = useRef(null)
  const fromRuler = (clientX) => {
    const r = rulerRef.current?.getBoundingClientRect()
    if (!r) return
    const t = Math.max(0, Math.min(1, (clientX - r.left) / r.width))
    select(Math.round(t * (N - 1)))
  }

  return (
    <div className="scene sk" ref={sceneRef}>
      {/* Mot géant, coupé par le bas de l'écran */}
      <motion.div className="sk-word" aria-hidden="true" animate={{ opacity: open ? 0 : 1, y: open ? 40 : 0 }} transition={{ duration: 0.6, ease: EASE }}>
        {BRAND.bigWord}
      </motion.div>

      {/* Fil */}
      <motion.svg className="sk-thread" width={box.w} height={box.h} animate={{ opacity: open ? 0 : 1 }}>
        <motion.path d={threadPath} fill="none" stroke="rgba(17,17,17,.16)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: EASE }} />
      </motion.svg>

      {/* Titre */}
      <motion.div className="sk-title" animate={{ opacity: open ? 0 : 1 }} style={{ pointerEvents: open ? 'none' : 'auto' }}>
        <span className="sk-count">
          {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
        </span>
        <AnimatePresence mode="popLayout">
          <motion.div key={product.id} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            <h1 className="sk-name">{product.name}</h1>
            <p className="sk-price">{formatPrice(product.price)}</p>
          </motion.div>
        </AnimatePresence>
        <button className="link-arrow" onClick={() => setOpen(true)}>
          Voir les détails <span>→</span>
        </button>
      </motion.div>

      {/* Les paires */}
      <motion.div
        className="sk-field"
        onPanEnd={(_, info) => {
          if (open) return
          if (info.offset.x < -40 || info.offset.y > 50) go(1)
          else if (info.offset.x > 40 || info.offset.y < -50) go(-1)
        }}
      >
        {sneakers.map((s, i) => {
          const d = i - active
          const pl = placement(i)
          const isActive = d === 0
          return (
            <motion.div
              key={s.id}
              className="sk-shoe"
              style={{ width: shoeW, height: shoeH, marginLeft: -shoeW / 2, marginTop: -shoeH / 2, zIndex: 100 - Math.abs(d), pointerEvents: pl.opacity === 0 ? 'none' : 'auto' }}
              initial={{ opacity: 0, x: pl.x + 200, y: pl.y - 160, scale: pl.scale * 0.6 }}
              animate={pl}
              transition={SPRING}
              onClick={() => {
                if (open) return
                if (isActive) setOpen(true)
                else select(i)
              }}
            >
              <motion.div
                className="sk-float"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.2 + (i % 3) * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
                whileHover={!open ? { scale: 1.06 } : undefined}
              >
                <SneakerVisual product={s} colorwayIndex={isActive ? colorway : 0} className="fill" allow3D={Math.abs(d) <= 1} interactive={open && isActive} autoRotate={open && isActive} />
              </motion.div>
              <div className="sk-shadow" />
            </motion.div>
          )
        })}
      </motion.div>

      {/* Règle graduée */}
      <motion.div className="sk-ruler-wrap" animate={{ opacity: open ? 0 : 1 }} style={{ pointerEvents: open ? 'none' : 'auto' }}>
        <div
          className="sk-ruler"
          ref={rulerRef}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            fromRuler(e.clientX)
          }}
          onPointerMove={(e) => e.buttons && fromRuler(e.clientX)}
        >
          <motion.span className="sk-ruler-thumb" animate={{ left: `${(active / (N - 1)) * 100}%` }} transition={{ type: 'spring', stiffness: 260, damping: 30 }} />
        </div>
        <span className="sk-ruler-label">Glisse pour parcourir</span>
      </motion.div>

      {/* Pointures rapides */}
      <motion.div className="sk-quick" animate={{ opacity: open ? 0 : 1 }} style={{ pointerEvents: open ? 'none' : 'auto' }}>
        {QUICK_SIZES.map((s) => (
          <button
            key={s}
            onClick={() => {
              setPresetSize(s)
              setOpen(true)
            }}
          >
            {s}
          </button>
        ))}
      </motion.div>

      <AnimatePresence>
        {open && (
          <ShoeDetail
            key="detail"
            product={product}
            active={active}
            colorway={colorway}
            setColorway={setColorway}
            presetSize={presetSize}
            onSelect={select}
            onClose={() => {
              setOpen(false)
              setPresetSize(null)
            }}
            mobile={mobile}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ShoeDetail({ product, active, colorway, setColorway, presetSize, onSelect, onClose, mobile }) {
  const { add, fly } = useBag()
  const [size, setSize] = useState(presetSize)
  const [state, setState] = useState('idle') // idle | loading | added
  const [more, setMore] = useState(false)
  const outOfStock = (i) => i % 5 === 3

  useEffect(() => {
    setState('idle')
  }, [product.id])

  const addToBag = () => {
    if (!size || state !== 'idle') return
    setState('loading')
    setTimeout(() => {
      add({ product, size })
      const el = document.querySelectorAll('.sk-shoe')[active]
      const r = el?.getBoundingClientRect()
      if (r) fly(product, r)
      setState('added')
    }, 800)
  }

  return (
    <>
      <motion.button className="close-btn sk-close" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        Fermer <span>✕</span>
      </motion.button>

      {/* Vignettes sous la chaussure : coloris du modèle, sinon les autres paires */}
      <motion.div className="sk-thumbs" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ delay: 0.35, duration: 0.4 }}>
        {product.colorways.length > 1
          ? product.colorways.map((cw, i) => (
              <button key={i} className={`sk-thumb ${i === colorway ? 'on' : ''}`} onClick={() => setColorway(i)} title={cw.label}>
                <SneakerVisual product={product} colorwayIndex={i} className="fill" />
              </button>
            ))
          : sneakers.map((s, i) => (
              <button key={s.id} className={`sk-thumb ${i === active ? 'on' : ''}`} onClick={() => onSelect(i)} title={s.name}>
                <SneakerVisual product={s} className="fill" />
              </button>
            ))}
      </motion.div>

      <motion.aside className="sk-info" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
        <AnimatePresence mode="wait">
          <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <h2 className="sk-dname">{product.name}</h2>
            <p className="sk-dprice">{formatPrice(product.price)}</p>
          </motion.div>
        </AnimatePresence>

        <span className="field-label">Pointure (EU)</span>
        <div className="sk-sizes">
          {SIZES_SHOES.map((s, i) => (
            <button
              key={s}
              className={`sk-size ${size === s ? 'on' : ''}`}
              disabled={outOfStock(i)}
              onClick={() => {
                setSize(s)
                setState('idle')
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <motion.button
          className={`sk-add ${size ? 'ready' : ''} ${state === 'added' ? 'added' : ''}`}
          onClick={addToBag}
          disabled={!size}
          whileTap={size ? { scale: 0.97 } : undefined}
        >
          {state === 'loading' ? <span className="sk-spin" /> : state === 'added' ? 'Ajouté au panier ✓' : size ? 'Ajouter au panier' : 'Choisis ta pointure'}
        </motion.button>

        <button className="link-arrow sk-more" onClick={() => setMore((m) => !m)}>
          {more ? 'Masquer les détails' : 'Voir les détails'} <span>→</span>
        </button>
        <AnimatePresence>
          {more && (
            <motion.p className="muted small" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              {product.colorways[colorway]?.label || product.subtitle} · Livraison offerte dès 100 € · Retours gratuits sous 30 jours.
              {product.model && !mobile ? ' Glisse sur la chaussure pour la faire tourner.' : ''}
            </motion.p>
          )}
        </AnimatePresence>
        {product.credit && <p className="muted small credit">{product.credit}</p>}
      </motion.aside>
    </>
  )
}
