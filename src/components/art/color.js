// Assombrit (amt < 0) ou éclaircit (amt > 0) une couleur hexadécimale.
export function shade(hex, amt) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  let r = (num >> 16) & 255
  let g = (num >> 8) & 255
  let b = num & 255
  const t = amt < 0 ? 0 : 255
  const p = Math.abs(amt)
  r = Math.round((t - r) * p + r)
  g = Math.round((t - g) * p + g)
  b = Math.round((t - b) * p + b)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function isLight(hex) {
  const h = hex.replace('#', '')
  const num = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 150
}
