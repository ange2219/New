import { useId } from 'react'
import { shade } from './color.js'
import { byId } from '../../data/catalog.js'

// Mannequin provisoire (vue de face), composé à partir des produits du look.
// viewBox 200 x 540
export const FIGURE_HOTSPOTS = {
  top: { x: 50, y: 33 },
  bottom: { x: 61, y: 68 },
  shoes: { x: 36, y: 91 },
  cap: { x: 56, y: 5.5 },
  glasses: { x: 50, y: 9.4 },
  chain: { x: 50, y: 21 },
  watch: { x: 23.5, y: 49.6 },
  bracelet: { x: 76.5, y: 49.6 },
  ring: { x: 77, y: 55.5 },
}

export default function Figure({ look, className, style }) {
  const uid = useId().replace(/:/g, '')
  const top = byId(look.top)
  const bottom = byId(look.bottom)
  const shoes = byId(look.shoes)
  const cw = shoes.colorways[0]
  const skin = look.skin
  const skinDark = shade(skin, -0.15)
  const tc = top.color
  const tDark = shade(tc, -0.2)
  const bc = bottom.color
  const bDark = shade(bc, -0.22)
  const baggy = bottom.fit === 'baggy'
  const longSleeve = top.type !== 'tee'
  const accs = (look.acc || []).map(byId).filter(Boolean)
  const acc = (type) => accs.find((a) => a.type === type)
  const glasses = acc('glasses')
  const cap = acc('cap')
  const chain = acc('chain')
  const watch = acc('watch')
  const bracelet = acc('bracelet')
  const ring = acc('ring')
  const handY = longSleeve ? 280 : 276

  const pants = baggy
    ? 'M58 266 L142 266 L154 486 L106 489 L100 334 L94 489 L46 486 Z'
    : 'M62 266 L138 266 L143 486 L105 489 L100 334 L95 489 L57 486 Z'

  const torso = longSleeve
    ? 'M64 98 C82 90 118 90 136 98 L156 112 C162 160 164 220 162 268 L145 270 L145 286 L55 286 L55 270 L38 268 C36 220 38 160 44 112 Z'
    : 'M64 98 C82 90 118 90 136 98 L152 108 L160 164 L144 168 L145 286 L55 286 L56 168 L40 164 L48 108 Z'

  return (
    <svg viewBox="0 0 200 540" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={`shadow-${uid}`}>
          <stop offset="0" stopColor="#000" stopOpacity=".22" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`body-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".14" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".07" />
          <stop offset=".7" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="506" rx="78" ry="12" fill={`url(#shadow-${uid})`} />

      {/* Cheveux longs (derrière la tête) */}
      {look.hairStyle === 'long' && (
        <path d="M78 46 C74 20 126 20 122 46 L128 112 C116 118 84 118 72 112 Z" fill={look.hair} />
      )}

      {/* Chaussures */}
      <g>
        <path d="M46 484 C44 498 52 504 70 504 L98 504 C102 500 101 492 96 484 Z" fill={cw.upper} />
        <path d="M44 498 L99 498 L99 506 L46 506 C42 506 42 500 44 498 Z" fill={cw.sole} />
        <path d="M104 484 C99 492 98 500 102 504 L130 504 C148 504 156 498 154 484 Z" fill={cw.upper} />
        <path d="M101 498 L156 498 C158 500 158 506 154 506 L101 506 Z" fill={cw.sole} />
        <path d="M58 488 L92 488" stroke={cw.panel} strokeWidth="4" opacity=".8" />
        <path d="M108 488 L142 488" stroke={cw.panel} strokeWidth="4" opacity=".8" />
      </g>

      {/* Pantalon */}
      <path d={pants} fill={bc} />
      <path d="M100 286 L100 334" stroke={bDark} strokeWidth="2" />
      <path d={baggy ? 'M60 300 C64 360 62 420 52 480' : 'M64 300 C66 360 64 420 60 480'} stroke={bDark} strokeWidth="1.5" fill="none" opacity=".5" />
      <path d={baggy ? 'M140 300 C136 360 138 420 148 480' : 'M136 300 C134 360 136 420 140 480'} stroke={bDark} strokeWidth="1.5" fill="none" opacity=".5" />
      <path d="M70 470 L92 474 M108 474 L130 470" stroke={bDark} strokeWidth="2" opacity=".5" />
      <path d={pants} fill={`url(#body-${uid})`} />

      {/* Bras (peau) pour t-shirt */}
      {!longSleeve && (
        <>
          <path d="M42 162 L56 166 L54 266 L41 266 Z" fill={skin} />
          <path d="M144 166 L158 162 L159 266 L146 266 Z" fill={skin} />
        </>
      )}

      {/* Haut */}
      <path d={torso} fill={tc} />
      {longSleeve && (
        <>
          <path d="M56 140 L55 268" stroke={tDark} strokeWidth="1.6" opacity=".55" />
          <path d="M144 140 L145 268" stroke={tDark} strokeWidth="1.6" opacity=".55" />
          {top.type !== 'jacket' && <rect x="55" y="276" width="90" height="10" rx="2" fill={tDark} />}
          <rect x="37" y="260" width="19" height="9" rx="2" fill={tDark} />
          <rect x="144" y="260" width="19" height="9" rx="2" fill={tDark} />
        </>
      )}
      {top.type === 'hoodie' && (
        <>
          <path d="M76 98 C78 80 122 80 124 98 C112 110 88 110 76 98 Z" fill={shade(tc, 0.1)} />
          <path d="M92 104 L91 140 M108 104 L109 140" stroke={shade(tc, -0.45)} strokeWidth="2" strokeLinecap="round" />
          <path d="M70 214 L130 214 L136 262 L64 262 Z" fill="none" stroke={tDark} strokeWidth="2" />
        </>
      )}
      {top.type === 'jacket' && (
        <>
          <path d="M84 94 L100 128 L116 94" fill="none" stroke={tDark} strokeWidth="6" />
          <path d="M100 128 L100 286" stroke={shade(tc, -0.4)} strokeWidth="2" />
          {[150, 190, 230, 268].map((y) => (
            <circle key={y} cx="100" cy={y} r="2" fill={top.accent} />
          ))}
        </>
      )}
      {top.type === 'crewneck' && <path d="M86 96 C92 108 108 108 114 96" fill="none" stroke={tDark} strokeWidth="5" />}
      {top.type === 'tee' && <path d="M88 96 C92 106 108 106 112 96" fill="none" stroke={tDark} strokeWidth="4" />}
      {top.print && top.type === 'tee' && (
        <text x="100" y="150" textAnchor="middle" fontSize="13" fontWeight="800" fill={top.accent} fontFamily="Inter, sans-serif" letterSpacing="1">
          {top.print[0]}
        </text>
      )}
      <path d={torso} fill={`url(#body-${uid})`} />

      {/* Mains */}
      <ellipse cx={longSleeve ? 47 : 47} cy={longSleeve ? 280 : 276} rx="8" ry="11" fill={skin} />
      <ellipse cx={longSleeve ? 153 : 153} cy={longSleeve ? 280 : 276} rx="8" ry="11" fill={skin} />

      {/* Cou + tête */}
      <path d="M91 70 L109 70 L110 96 C104 100 96 100 90 96 Z" fill={skinDark} />
      <ellipse cx="81" cy="56" rx="4" ry="7" fill={skinDark} />
      <ellipse cx="119" cy="56" rx="4" ry="7" fill={skinDark} />
      <ellipse cx="100" cy="52" rx="19" ry="24" fill={skin} />
      <path d="M92 66 C96 69 104 69 108 66" stroke={shade(skin, -0.35)} strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Coiffure */}
      {look.hairStyle === 'short' && <path d="M80 50 C78 22 122 22 120 50 C116 36 108 33 100 33 C92 33 84 36 80 50 Z" fill={look.hair} />}
      {look.hairStyle === 'buzz' && <path d="M81 46 C82 26 118 26 119 46 C112 36 88 36 81 46 Z" fill={look.hair} opacity=".9" />}
      {look.hairStyle === 'curly' && (
        <g fill={look.hair}>
          {[[84, 38], [92, 30], [101, 28], [110, 30], [117, 38], [80, 47], [120, 47], [96, 34], [106, 34]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="8" />
          ))}
        </g>
      )}
      {look.hairStyle === 'long' && <path d="M80 54 C76 22 124 22 120 54 C114 38 106 34 100 36 C92 34 84 40 80 54 Z" fill={look.hair} />}

      {/* Yeux / lunettes */}
      {glasses ? (
        <g>
          <rect x="83" y="46" width="15" height="9" rx="3.5" fill={glasses.lens} stroke={glasses.color} strokeWidth="1.6" />
          <rect x="102" y="46" width="15" height="9" rx="3.5" fill={glasses.lens} stroke={glasses.color} strokeWidth="1.6" />
          <path d="M98 50 L102 50 M83 49 L80 48 M117 49 L120 48" stroke={glasses.color} strokeWidth="1.6" />
        </g>
      ) : (
        <g fill={shade(skin, -0.6)}>
          <ellipse cx="92" cy="51" rx="2" ry="1.6" />
          <ellipse cx="108" cy="51" rx="2" ry="1.6" />
        </g>
      )}

      {/* Casquette */}
      {cap && (
        <g>
          <path d="M79 44 C78 18 122 18 121 44 Z" fill={cap.color} />
          <path d="M100 20 L100 44" stroke={shade(cap.color, -0.2)} strokeWidth="1" />
          <ellipse cx="100" cy="44" rx="25" ry="5" fill={shade(cap.color, -0.18)} />
          {cap.accent && <rect x="94" y="30" width="12" height="6" rx="1.5" fill={cap.accent} />}
        </g>
      )}

      {/* Chaîne */}
      {chain && (
        <g>
          <path d="M87 94 C88 122 112 122 113 94" fill="none" stroke={chain.color} strokeWidth="2.6" strokeDasharray="3 1.6" />
          {chain.pendant && <circle cx="100" cy="122" r="4" fill={chain.color} stroke={shade(chain.color, -0.3)} strokeWidth=".8" />}
        </g>
      )}

      {/* Montre (poignet gauche), bracelet (poignet droit), bague (main droite) */}
      {watch && (
        <g>
          <rect x="39" y={handY - 15} width="16" height="7" rx="2" fill={watch.strap || watch.color} />
          <circle cx="47" cy={handY - 11.5} r="5" fill={watch.color} />
          <circle cx="47" cy={handY - 11.5} r="3.4" fill={watch.dial || '#111'} />
        </g>
      )}
      {bracelet && <rect x="145" y={handY - 14} width="16" height="5" rx="2.5" fill={bracelet.color} stroke={shade(bracelet.color, -0.3)} strokeWidth=".6" />}
      {ring && <rect x="150" y={handY + 6} width="7" height="3.2" rx="1.6" fill={ring.color} stroke={shade(ring.color, -0.3)} strokeWidth=".6" />}
    </svg>
  )
}
