import { useId } from 'react'
import { shade } from './color.js'

// Visuels provisoires des accessoires (viewBox 200 x 200).
export default function Accessory({ product, className, style }) {
  const uid = useId().replace(/:/g, '')
  const c = product.color
  const metal = (
    <linearGradient id={`m-${uid}`} x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor={shade(c, 0.45)} />
      <stop offset=".45" stopColor={c} />
      <stop offset=".6" stopColor={shade(c, -0.25)} />
      <stop offset="1" stopColor={shade(c, 0.2)} />
    </linearGradient>
  )
  const M = `url(#m-${uid})`
  let body = null

  switch (product.type) {
    case 'glasses': {
      const lens = product.lens || '#1a1a1a'
      body = (
        <g>
          <path d="M18 92 L6 84" stroke={c} strokeWidth="6" strokeLinecap="round" />
          <path d="M182 92 L194 84" stroke={c} strokeWidth="6" strokeLinecap="round" />
          <rect x="18" y="78" width="72" height="50" rx="20" fill={lens} stroke={c} strokeWidth="7" />
          <rect x="110" y="78" width="72" height="50" rx="20" fill={lens} stroke={c} strokeWidth="7" />
          <path d="M90 92 C96 84 104 84 110 92" fill="none" stroke={c} strokeWidth="6" />
          <path d="M30 88 L52 88" stroke="#fff" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round" />
          <path d="M122 88 L144 88" stroke="#fff" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round" />
        </g>
      )
      break
    }
    case 'cap': {
      const dark = shade(c, -0.2)
      body = (
        <g>
          <path d="M40 120 C36 70 70 44 110 44 C150 44 176 72 172 122 Z" fill={c} />
          <path d="M110 44 C104 70 100 96 100 122" stroke={dark} strokeWidth="2" fill="none" />
          <path d="M110 44 C130 66 146 92 150 122" stroke={dark} strokeWidth="2" fill="none" />
          <path d="M110 44 C86 62 66 90 62 122" stroke={dark} strokeWidth="2" fill="none" />
          <circle cx="110" cy="44" r="5" fill={dark} />
          <path d="M28 122 C60 112 150 112 196 128 C176 146 70 148 22 134 C18 130 20 124 28 122 Z" fill={dark} />
          <path d="M40 120 C80 112 140 112 172 122" stroke={shade(c, -0.35)} strokeWidth="3" fill="none" />
          {product.accent && <rect x="82" y="80" width="30" height="16" rx="3" fill={product.accent} transform="rotate(-6 97 88)" />}
        </g>
      )
      break
    }
    case 'chain': {
      const links = Array.from({ length: 26 }, (_, i) => {
        const t = (i / 25) * Math.PI
        return { x: 100 - Math.cos(t) * 70, y: 40 + Math.sin(t) * 118, r: (i * 23) % 180 }
      })
      body = (
        <g>
          {links.map((l, i) => (
            <ellipse key={i} cx={l.x} cy={l.y} rx="8" ry="5" fill="none" stroke={M} strokeWidth="4" transform={`rotate(${i % 2 ? 60 : -60} ${l.x} ${l.y})`} />
          ))}
          {product.pendant && <circle cx="100" cy="168" r="14" fill={M} stroke={shade(c, -0.3)} strokeWidth="2" />}
        </g>
      )
      break
    }
    case 'watch': {
      const strap = product.strap || c
      body = (
        <g>
          <rect x="74" y="6" width="52" height="70" rx="10" fill={strap} />
          <rect x="74" y="124" width="52" height="70" rx="10" fill={strap} />
          {[16, 30, 44, 58, 136, 150, 164, 178].map((y) => (
            <path key={y} d={`M76 ${y} L124 ${y}`} stroke={shade(strap, -0.25)} strokeWidth="1.5" />
          ))}
          <rect x="146" y="92" width="10" height="16" rx="3" fill={M} />
          <circle cx="100" cy="100" r="50" fill={M} />
          <circle cx="100" cy="100" r="40" fill={product.dial || '#111'} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            return <path key={i} d={`M${100 + Math.sin(a) * 32} ${100 - Math.cos(a) * 32} L${100 + Math.sin(a) * 37} ${100 - Math.cos(a) * 37}`} stroke="#ddd" strokeWidth={i % 3 ? 1.5 : 3} />
          })}
          <path d="M100 100 L100 72" stroke="#eee" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 100 L120 108" stroke="#eee" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 100 L86 128" stroke="#e33" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="100" cy="100" r="3.5" fill="#eee" />
        </g>
      )
      break
    }
    case 'bracelet': {
      const n = product.beads ? 18 : 22
      body = (
        <g>
          {Array.from({ length: n }, (_, i) => {
            const a = (i / n) * Math.PI * 2
            const x = 100 + Math.cos(a) * 66
            const y = 100 + Math.sin(a) * 38
            const front = Math.sin(a) > 0
            return product.beads ? (
              <circle key={i} cx={x} cy={y} r={front ? 13 : 10} fill={M} opacity={front ? 1 : 0.75} />
            ) : (
              <rect key={i} x={x - 9} y={y - 7} width="18" height="14" rx="4" fill={M} opacity={front ? 1 : 0.7} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />
            )
          })}
        </g>
      )
      break
    }
    case 'ring': {
      body = (
        <g>
          <ellipse cx="100" cy="118" rx="60" ry="40" fill="none" stroke={M} strokeWidth="18" />
          <ellipse cx="100" cy="118" rx="60" ry="40" fill="none" stroke={shade(c, -0.3)} strokeWidth="1.5" opacity=".5" />
          {product.signet && (
            <g>
              <path d="M70 84 L130 84 L124 64 L76 64 Z" fill={shade(c, -0.15)} />
              <ellipse cx="100" cy="64" rx="26" ry="10" fill={M} />
              <path d="M90 64 L110 64" stroke={shade(c, -0.4)} strokeWidth="2" />
            </g>
          )}
        </g>
      )
      break
    }
    default:
      body = null
  }

  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden="true">
      <defs>{metal}</defs>
      {body}
    </svg>
  )
}
