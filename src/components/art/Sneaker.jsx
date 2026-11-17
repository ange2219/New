import { useId } from 'react'
import { shade } from './color.js'

// Visuel provisoire d'une sneaker vue de profil (pointe à gauche).
// viewBox 400 x 220
export default function Sneaker({ shape = 'low', colorway, className, style, flip = false }) {
  const uid = useId().replace(/:/g, '')
  const { upper, panel, sole, outsole, laces, accent } = colorway
  const high = shape === 'high'

  // Tige (upper)
  const upperPath = high
    ? 'M24 150 C20 128 38 116 78 110 L146 100 C164 88 182 66 202 48 L222 22 C230 12 246 8 262 10 L328 18 C344 22 352 34 354 52 L362 104 L378 150 Z'
    : 'M24 150 C20 128 38 116 78 110 L148 102 C170 96 190 88 212 82 L246 76 C266 72 292 72 314 74 L340 78 C356 84 364 100 368 116 L378 150 Z'

  // Empiècement de talon + pare-pierre (pointe)
  const heelPath = high
    ? 'M296 150 L300 58 C312 40 336 38 350 52 L362 104 L378 150 Z'
    : 'M300 150 L306 96 C318 80 344 80 358 92 L368 116 L378 150 Z'
  const toePath = 'M24 150 C20 128 38 116 78 110 L104 108 C96 122 96 138 100 150 Z'

  // Panneau latéral (bande décorative, générique)
  const sidePanel = high
    ? 'M118 148 C150 128 200 118 270 92 L296 82 L300 100 C250 122 196 136 160 150 Z'
    : 'M128 148 C160 136 210 126 276 112 L300 106 L302 122 C252 132 204 142 170 150 Z'

  const collar = high ? 'M222 22 C244 34 290 34 328 18' : 'M212 82 C240 88 292 88 340 78'
  const tongue = high
    ? 'M196 52 L210 14 C214 4 232 2 236 12 L226 30 Z'
    : 'M204 86 L216 60 C222 52 240 52 242 62 L234 78 Z'

  const laceStart = high ? [154, 98] : [158, 100]
  const laceEnd = high ? [214, 34] : [226, 80]
  const laceCount = high ? 7 : 4
  const laceLines = Array.from({ length: laceCount }, (_, i) => {
    const t = i / (laceCount - 1)
    const x = laceStart[0] + (laceEnd[0] - laceStart[0]) * t
    const y = laceStart[1] + (laceEnd[1] - laceStart[1]) * t
    return { x, y }
  })

  return (
    <svg
      viewBox="0 0 400 220"
      className={className}
      style={{ ...style, transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`up-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id={`so-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* Tige */}
      <path d={upperPath} fill={upper} />
      <path d={tongue} fill={shade(upper, -0.12)} />
      <path d={toePath} fill={panel} />
      <path d={heelPath} fill={panel} />
      <path d={sidePanel} fill={accent || panel} opacity={accent ? 1 : 0.92} />

      {/* Perforations sur la pointe */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={46 + (i % 3) * 12} cy={128 + Math.floor(i / 3) * 10} r="1.8" fill={shade(panel, -0.35)} opacity=".6" />
      ))}

      {/* Col rembourré */}
      <path d={collar} fill="none" stroke={shade(upper, -0.35)} strokeWidth="7" strokeLinecap="round" />

      {/* Laçage */}
      {laceLines.map(({ x, y }, i) => (
        <g key={i}>
          <circle cx={x - 6} cy={y + 8} r="2.4" fill={shade(upper, -0.4)} />
          <path d={`M${x - 10} ${y + 4} L${x + 12} ${y - 6}`} stroke={laces} strokeWidth="5" strokeLinecap="round" />
          <path d={`M${x - 10} ${y + 4} L${x + 12} ${y - 6}`} stroke="#000" strokeOpacity=".15" strokeWidth="1" />
        </g>
      ))}
      <path d={upperPath} fill={`url(#up-${uid})`} />

      {/* Semelle intermédiaire + extérieure */}
      <path d="M16 148 C12 170 30 178 52 178 L352 178 C378 178 392 168 388 146 Z" fill={sole} />
      <path d="M16 148 C12 170 30 178 52 178 L352 178 C378 178 392 168 388 146 Z" fill={`url(#so-${uid})`} />
      {high ? null : <path d="M60 162 L340 162" stroke={shade(sole, -0.14)} strokeWidth="2" />}
      <path d="M22 176 C30 186 44 188 56 188 L350 188 C370 188 384 182 386 166 C380 176 366 180 352 180 L52 180 C38 180 28 178 22 176 Z" fill={outsole} />
    </svg>
  )
}
