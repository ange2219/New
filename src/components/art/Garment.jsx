import { useId } from 'react'
import { shade } from './color.js'

// Visuel provisoire d'un haut (face ou dos), dessiné en SVG.
// viewBox 300 x 340 — le haut du vêtement (col / capuche) est vers y=15.
export default function Garment({ product, color, side = 'front', className, style }) {
  const uid = useId().replace(/:/g, '')
  const c = color || product.color
  const dark = shade(c, -0.18)
  const darker = shade(c, -0.32)
  const light = shade(c, 0.12)
  const accent = product.accent || '#222'
  const isFront = side === 'front'
  const { type } = product

  const shading = (
    <defs>
      <linearGradient id={`sh-${uid}`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.16" />
        <stop offset="0.28" stopColor="#fff" stopOpacity="0.08" />
        <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id={`vs-${uid}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.06" />
        <stop offset="1" stopColor="#000" stopOpacity="0.12" />
      </linearGradient>
    </defs>
  )

  let body
  let details = null

  if (type === 'tee') {
    body = 'M98 42 C122 54 178 54 202 42 L268 72 L248 138 L216 122 L218 322 L82 322 L84 122 L52 138 L32 72 Z'
    details = (
      <>
        {isFront ? (
          <path d="M112 46 C128 74 172 74 188 46" fill="none" stroke={dark} strokeWidth="7" strokeLinecap="round" />
        ) : (
          <path d="M106 44 C130 58 170 58 194 44" fill="none" stroke={dark} strokeWidth="6" strokeLinecap="round" />
        )}
        <path d="M52 138 L32 72" stroke={darker} strokeWidth="2" opacity=".4" />
        <path d="M84 122 L86 150" stroke={dark} strokeWidth="1.5" opacity=".5" />
        <path d="M216 122 L214 150" stroke={dark} strokeWidth="1.5" opacity=".5" />
      </>
    )
  } else {
    // sweat à manches longues (hoodie / crewneck / jacket)
    body = 'M96 52 C116 44 184 44 204 52 L258 82 C272 120 282 210 292 300 L254 306 C246 240 240 190 236 150 L238 318 L62 318 L64 150 C60 190 54 240 46 306 L8 300 C18 210 28 120 42 82 Z'
    const cuffs = (
      <>
        <path d="M8 300 L46 306 L44 322 L7 316 Z" fill={dark} />
        <path d="M254 306 L292 300 L293 316 L256 322 Z" fill={dark} />
      </>
    )
    const hem = type === 'jacket' ? null : <rect x="62" y="304" width="176" height="16" rx="3" fill={dark} />
    const sleeveSeams = (
      <>
        <path d="M64 150 C66 120 70 95 96 56" fill="none" stroke={darker} strokeWidth="1.6" opacity=".35" />
        <path d="M236 150 C234 120 230 95 204 56" fill="none" stroke={darker} strokeWidth="1.6" opacity=".35" />
      </>
    )

    if (type === 'hoodie') {
      details = (
        <>
          {cuffs}
          {hem}
          {sleeveSeams}
          {isFront ? (
            <>
              <path d="M100 70 C92 28 124 10 150 10 C176 10 208 28 200 70 C184 86 116 86 100 70 Z" fill={light} />
              <path d="M118 72 C118 42 134 30 150 30 C166 30 182 42 182 72 C170 82 130 82 118 72 Z" fill={darker} />
              <path d="M138 80 L134 146" stroke={shade(c, -0.45)} strokeWidth="3" strokeLinecap="round" />
              <path d="M162 80 L166 146" stroke={shade(c, -0.45)} strokeWidth="3" strokeLinecap="round" />
              <circle cx="134" cy="148" r="3.5" fill={shade(c, -0.5)} />
              <circle cx="166" cy="148" r="3.5" fill={shade(c, -0.5)} />
              <path d="M94 222 L206 222 L222 300 L78 300 Z" fill="none" stroke={dark} strokeWidth="3" strokeLinejoin="round" />
            </>
          ) : (
            <>
              <path d="M96 76 C88 20 122 2 150 2 C178 2 212 20 204 76 C186 96 114 96 96 76 Z" fill={dark} />
              <path d="M150 4 C150 30 150 60 150 88" stroke={darker} strokeWidth="2" opacity=".6" />
            </>
          )}
        </>
      )
    } else if (type === 'crewneck') {
      details = (
        <>
          {cuffs}
          {hem}
          {sleeveSeams}
          {isFront ? (
            <>
              <path d="M112 52 C126 80 174 80 188 52" fill="none" stroke={dark} strokeWidth="10" strokeLinecap="round" />
              <path d="M144 76 L150 88 L156 76 Z" fill={dark} />
            </>
          ) : (
            <path d="M108 50 C130 62 170 62 192 50" fill="none" stroke={dark} strokeWidth="9" strokeLinecap="round" />
          )}
        </>
      )
    } else if (type === 'jacket') {
      details = (
        <>
          {cuffs}
          <rect x="62" y="306" width="176" height="12" rx="3" fill={dark} />
          {sleeveSeams}
          {isFront ? (
            <>
              <path d="M102 50 L150 96 L198 50 L208 62 L150 116 L92 62 Z" fill={dark} />
              <path d="M150 100 L150 316" stroke={darker} strokeWidth="3" />
              {[130, 170, 210, 250, 290].map((y) => (
                <circle key={y} cx="150" cy={y} r="3.2" fill={accent} />
              ))}
              <path d="M84 200 L122 200" stroke={darker} strokeWidth="3" strokeLinecap="round" />
              <path d="M178 200 L216 200" stroke={darker} strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M100 48 C130 64 170 64 200 48 L204 62 C172 78 128 78 96 62 Z" fill={dark} />
              <path d="M70 150 L230 150" stroke={darker} strokeWidth="1.6" opacity=".4" />
            </>
          )}
        </>
      )
    }
  }

  const print = isFront && product.print ? (
    <g fontFamily="'Permanent Marker', 'Comic Sans MS', 'Segoe Print', cursive" fontWeight="700" fill={accent} textAnchor="middle">
      {product.print.map((line, i) => (
        <text
          key={i}
          x="150"
          y={(type === 'hoodie' ? 120 : 130) + i * 26 + (4 - product.print.length) * 10}
          fontSize={product.print.length > 2 ? 24 : 30}
          transform={`rotate(-3 150 ${150 + i * 26})`}
        >
          {line}
        </text>
      ))}
    </g>
  ) : null

  return (
    <svg viewBox="0 0 300 340" className={className} style={style} aria-hidden="true">
      {shading}
      <path d={body} fill={c} />
      {details}
      {print}
      <path d={body} fill={`url(#sh-${uid})`} />
      <path d={body} fill={`url(#vs-${uid})`} />
    </svg>
  )
}
