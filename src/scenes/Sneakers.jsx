import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import { BRAND, SIZES_SHOES, formatPrice, sneakers } from '../data/catalog.js'
import { SneakerVisual } from '../components/Visuals.jsx'
import { useBag } from '../store.jsx'
import { EASE, useKey, useViewport } from '../hooks.js'

const N = sneakers.length
const QUICK_SIZES = ['40', '41', '42', '43', '44', '45', '46']
const SPRING = { type: 'spring', stiffness: 60, damping: 16, mass: 1 }
const DEG = Math.PI / 180
// Ramène un décalage dans [-N/2, N/2[ : le cercle boucle à l'infini
const wrap = (v) => ((((v % N) + N) % N) + N / 2) % N - N / 2

export default function Sneakers() {
  const pos = useMotionValue(0) // rotation du cercle (en nombre de paires)
  const openMv = useMotionValue(0) // 0 = cercle, 1 = fiche ouverte
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

  useMotionValueEvent(pos, 'change', (p) => {
    const a = ((Math.round(p) % N) + N) % N
    setActive((cur) => {
      if (cur !== a) setColorway(0)
      return a
    })
  })
  useEffect(() => {
    animate(openMv, open ? 1 : 0, { duration: 0.8, ease: EASE })
  }, [open, openMv])

  const go = useCallback((d) => animate(pos, Math.round(pos.get()) + d, SPRING), [pos])
  const select = useCallback((i) => animate(pos, Math.round(pos.get() + wrap(i - pos.get())), SPRING), [pos])

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

  // ── Géométrie : un arc de cercle à plat, comme dans la vidéo ──
  // Le centre du cercle est en bas à droite (hors écran) : les paires montent du bas-gauche
  // vers le haut-droite en suivant la courbe. La paire active est au milieu de l'arc.
  const shoeW = mobile ? Math.min(box.w * 0.38, 190) : Math.min(box.w * 0.15, 250)
  const shoeH = shoeW * 0.62
  const arc = mobile
    ? { cx: box.w * 0.92, cy: box.h * 0.72, r: box.w * 0.74, a0: -140 * DEG, step: 32 * DEG }
    : { cx: box.w * 0.78, cy: box.h * 0.8, r: Math.min(box.h * 0.64, box.w * 0.46), a0: -140 * DEG, step: 30 * DEG }
  const detailW = mobile ? Math.min(box.w * 0.82, 340) : Math.min(box.w * 0.4, 560)
  const detail = mobile ? { x: box.w * 0.5, y: box.h * 0.24 } : { x: box.w * 0.33, y: box.h * 0.45 }

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
        {sneakers.map((s, i) => (
          <RingShoe
            key={s.id}
            s={s}
            i={i}
            pos={pos}
            openMv={openMv}
            arc={arc}
            detail={detail}
            shoeW={shoeW}
            shoeH={shoeH}
            detailScale={detailW / shoeW}
            isActive={i === active}
            open={open}
            colorway={colorway}
            onClick={() => {
              if (open) return
              if (i === active) setOpen(true)
              else select(i)
            }}
          />
        ))}
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

function RingShoe({ s, i, pos, openMv, arc, detail, shoeW, shoeH, detailScale, isActive, open, colorway, onClick }) {
  const off = useTransform(pos, (p) => wrap(i - p))
  const focus = useTransform(off, (o) => Math.max(0, 1 - Math.abs(o) * 2))
  // point sur l'arc : un pas d'angle par paire
  const pt = useTransform(off, (o) => {
    const a = arc.a0 + o * arc.step
    return { x: arc.cx + Math.cos(a) * arc.r, y: arc.cy + Math.sin(a) * arc.r, d: Math.abs(o) }
  })
  const x = useTransform([pt, openMv, focus], ([p, t, f]) => p.x + t * f * (detail.x - p.x))
  const y = useTransform([pt, openMv, focus], ([p, t, f]) => p.y + t * f * (detail.y - p.y))
  const scale = useTransform([pt, openMv, focus], ([p, t, f]) => {
    const r = Math.max(0.3, 1 - p.d * 0.28) // la paire active est la plus grande
    return r + t * f * (detailScale - r)
  })
  const opacity = useTransform([off, openMv, focus], ([o, t, f]) => {
    // partie visible de l'arc : une paire avant, trois après
    const vis = o < 0 ? Math.min(1, Math.max(0, 2.2 + o)) : Math.min(1, Math.max(0, 3.4 - o))
    return vis * (1 - t * (1 - f))
  })
  const zIndex = useTransform(pt, (p) => Math.round(200 - p.d * 10))
  const filter = 'none'

  return (
    <motion.div
      className="sk-shoe"
      style={{ x, y, scale, opacity, filter, zIndex, rotate: -4, width: shoeW, height: shoeH, marginLeft: -shoeW / 2, marginTop: -shoeH / 2, pointerEvents: open && !isActive ? 'none' : 'auto' }}
      onClick={onClick}
    >
      <motion.div
        className="sk-float"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{ opacity: { duration: 0.6, delay: i * 0.06 }, y: { duration: 3.2 + (i % 3) * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 } }}
        whileHover={!open ? { scale: 1.06 } : undefined}
      >
        <SneakerVisual product={s} colorwayIndex={isActive ? colorway : 0} className="fill" allow3D interactive={open && isActive} autoRotate={open && isActive} />
      </motion.div>
      <div className="sk-shadow" />
    </motion.div>
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
