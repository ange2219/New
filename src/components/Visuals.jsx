import Garment from './art/Garment.jsx'
import Sneaker from './art/Sneaker.jsx'
import Figure from './art/Figure.jsx'
import Accessory from './art/Accessory.jsx'
import { ACC_TYPES } from '../data/catalog.js'

// Ces composants utilisent la vraie photo si elle est renseignée dans le catalogue,
// sinon le visuel provisoire en SVG.

export function GarmentVisual({ product, color, side = 'front', className, style }) {
  const src = side === 'back' ? product.imageBack || product.image : product.image
  if (src) return <img src={src} alt="" draggable="false" className={className} style={{ objectFit: 'contain', ...style }} />
  return <Garment product={product} color={color} side={side} className={className} style={style} />
}

export function SneakerVisual({ product, colorwayIndex = 0, className, style }) {
  const cw = product.colorways[colorwayIndex] || product.colorways[0]
  if (cw.image || product.image) {
    return <img src={cw.image || product.image} alt="" draggable="false" className={className} style={{ objectFit: 'contain', ...style }} />
  }
  return <Sneaker shape={product.shape} colorway={cw} className={className} style={style} />
}

export function LookVisual({ look, className, style }) {
  if (look.image) return <img src={look.image} alt="" draggable="false" className={className} style={{ objectFit: 'contain', ...style }} />
  return <Figure look={look} className={className} style={style} />
}

export function AccessoryVisual({ product, className, style }) {
  if (product.image) return <img src={product.image} alt="" draggable="false" className={className} style={{ objectFit: 'contain', ...style }} />
  return <Accessory product={product} className={className} style={style} />
}

export function ProductThumb({ product, className }) {
  if (ACC_TYPES[product.type]) return <AccessoryVisual product={product} className={className} />
  if (product.colorways) return <SneakerVisual product={product} className={className} />
  if (product.type === 'pants') return <PantsThumb product={product} className={className} />
  return <GarmentVisual product={product} className={className} />
}

function PantsThumb({ product, className }) {
  if (product.image) return <img src={product.image} alt="" className={className} style={{ objectFit: 'contain' }} />
  const dark = '#00000030'
  return (
    <svg viewBox="0 0 120 200" className={className} aria-hidden="true">
      <path d="M22 10 L98 10 L108 192 L66 194 L60 60 L54 194 L12 192 Z" fill={product.color} />
      <rect x="22" y="10" width="76" height="10" fill={dark} />
      <path d="M60 20 L60 60" stroke={dark} strokeWidth="2" />
    </svg>
  )
}
