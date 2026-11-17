// ─────────────────────────────────────────────────────────────
//  CATALOGUE — c'est ici que tu modifies tes produits.
//
//  Chaque produit peut recevoir de vraies photos :
//    image:     '/images/mon-hoodie-face.png'   (PNG détouré, fond transparent)
//    imageBack: '/images/mon-hoodie-dos.png'    (vue de dos, pour la rotation 360°)
//  Sans image, un visuel provisoire en SVG est dessiné automatiquement.
// ─────────────────────────────────────────────────────────────

export const BRAND = {
  name: 'STUDIO NOVA',
  currency: '€',
  tagline: 'Try the Look.',
  bigWord: 'OBSESSED',
}

export const SIZES_CLOTHES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
export const SIZES_SHOES = ['38', '39', '40', '40.5', '41', '42', '42.5', '43', '44', '44.5', '45', '46']

// ── Hauts (portant + looks) ──────────────────────────────────
// type : 'hoodie' | 'crewneck' | 'tee' | 'jacket'
export const tops = [
  { id: 'jk-navy', type: 'jacket', name: 'Coach Jacket', color: '#1f2a44', accent: '#e9e4d8', price: 149 },
  { id: 'hd-grey', type: 'hoodie', name: 'Heavy Hoodie', color: '#c9c9c7', accent: '#2b2b2b', price: 95, print: ['STAY', 'SOFT,', 'STAY', 'LOUD'] },
  { id: 'cr-cream', type: 'crewneck', name: 'Loop Crewneck', color: '#efe6cf', accent: '#b9a77c', price: 85 },
  { id: 'tee-black', type: 'tee', name: 'Boxy Tee', color: '#1b1b1d', accent: '#f2f2f2', price: 45, print: ['NOVA'] },
  { id: 'hd-sage', type: 'hoodie', name: 'Heavy Hoodie', color: '#9fb8a3', accent: '#2f4a38', price: 95 },
  { id: 'cr-forest', type: 'crewneck', name: 'Loop Crewneck', color: '#28513a', accent: '#d9e5d3', price: 85 },
  { id: 'tee-white', type: 'tee', name: 'Boxy Tee', color: '#f4f3ef', accent: '#1b1b1d', price: 45 },
  { id: 'hd-charcoal', type: 'hoodie', name: 'Heavy Hoodie', color: '#3a3b3f', accent: '#e9e9e9', price: 95, print: ['NOVA', 'CLUB'] },
  { id: 'jk-olive', type: 'jacket', name: 'Field Jacket', color: '#5d6340', accent: '#d8d2b8', price: 169 },
  { id: 'cr-burgundy', type: 'crewneck', name: 'Loop Crewneck', color: '#6e2a33', accent: '#f0d9dc', price: 85 },
  { id: 'hd-sand', type: 'hoodie', name: 'Heavy Hoodie', color: '#d8c4a2', accent: '#5b4a30', price: 95 },
  { id: 'tee-sky', type: 'tee', name: 'Boxy Tee', color: '#a9c6e0', accent: '#1f2a44', price: 45 },
  { id: 'hd-forest', type: 'hoodie', name: 'Heavy Hoodie', color: '#1f4b34', accent: '#e7efe5', price: 95 },
  { id: 'cr-heather', type: 'crewneck', name: 'Loop Crewneck', color: '#8f9399', accent: '#ffffff', price: 85 },
]

// Variantes de couleur proposées dans la fiche produit
export const colorOptions = ['#c9c9c7', '#3a3b3f', '#1f2a44', '#9fb8a3', '#d8c4a2', '#6e2a33', '#f4f3ef']

// ── Bas ──────────────────────────────────────────────────────
// fit : 'baggy' | 'straight'
export const bottoms = [
  { id: 'jn-light', type: 'pants', name: 'Wide Denim — Light Wash', color: '#a9c1d9', price: 120, fit: 'baggy' },
  { id: 'jn-mid', type: 'pants', name: 'Wide Denim — Mid Wash', color: '#6f8fb3', price: 120, fit: 'baggy' },
  { id: 'cg-brown', type: 'pants', name: 'Carpenter Pant — Brown', color: '#6b4e37', price: 110, fit: 'baggy' },
  { id: 'cg-grey', type: 'pants', name: 'Carpenter Pant — Stone', color: '#9a9a96', price: 110, fit: 'straight' },
  { id: 'tr-black', type: 'pants', name: 'Pleated Trouser — Black', color: '#202022', price: 130, fit: 'straight' },
  { id: 'jn-raw', type: 'pants', name: 'Wide Denim — Raw', color: '#2e3d5c', price: 120, fit: 'baggy' },
]

// ── Sneakers ─────────────────────────────────────────────────
// shape : 'high' | 'low'   — colorways : variantes affichées en miniatures
export const sneakers = [
  {
    id: 'nova-1', name: 'NOVA 1 HIGH', subtitle: 'Royal / Black', price: 189, shape: 'high',
    colorways: [
      { upper: '#1d4fc4', panel: '#121212', sole: '#f5f5f2', outsole: '#1b1b1b', laces: '#111' },
      { upper: '#b8202a', panel: '#121212', sole: '#f5f5f2', outsole: '#1b1b1b', laces: '#111' },
      { upper: '#e9e6df', panel: '#2a6b3c', sole: '#f5f5f2', outsole: '#d9c9a5', laces: '#fff' },
    ],
  },
  {
    id: 'orbit-low', name: 'ORBIT LOW', subtitle: 'Triple Black', price: 139, shape: 'low',
    colorways: [
      { upper: '#1c1c1e', panel: '#2b2b2e', sole: '#1c1c1e', outsole: '#111', laces: '#222' },
      { upper: '#f2f1ec', panel: '#e3e1da', sole: '#f2f1ec', outsole: '#cfc9bc', laces: '#fff' },
    ],
  },
  {
    id: 'drift-3', name: 'DRIFT 3 RETRO', subtitle: 'White / Cement / Fire Red', price: 209, shape: 'low',
    colorways: [
      { upper: '#f3f1ec', panel: '#9a9a98', sole: '#f6f6f3', outsole: '#c8322f', laces: '#fff', accent: '#c8322f' },
      { upper: '#1f1f21', panel: '#9a9a98', sole: '#f6f6f3', outsole: '#c8322f', laces: '#111', accent: '#c8322f' },
      { upper: '#f3f1ec', panel: '#3c6fb8', sole: '#f6f6f3', outsole: '#2a2a2a', laces: '#fff', accent: '#3c6fb8' },
    ],
  },
  {
    id: 'pulse-5', name: 'PULSE 5', subtitle: 'Bone / Volt', price: 159, shape: 'low',
    colorways: [
      { upper: '#e8e3d7', panel: '#c9ff3a', sole: '#ffffff', outsole: '#2a2a2a', laces: '#e8e3d7' },
      { upper: '#3b3f46', panel: '#ff6a2b', sole: '#ffffff', outsole: '#2a2a2a', laces: '#3b3f46' },
    ],
  },
  {
    id: 'halo-mid', name: 'HALO MID', subtitle: 'Sail / Forest', price: 179, shape: 'high',
    colorways: [
      { upper: '#f1ece0', panel: '#24543a', sole: '#f1ece0', outsole: '#b98d55', laces: '#f1ece0' },
      { upper: '#ece9e3', panel: '#6b2a34', sole: '#ece9e3', outsole: '#b98d55', laces: '#ece9e3' },
    ],
  },
  {
    id: 'vapor-run', name: 'VAPOR RUN', subtitle: 'Cloud / Ice Blue', price: 169, shape: 'low',
    colorways: [
      { upper: '#dfe7ef', panel: '#7fb3e6', sole: '#ffffff', outsole: '#9ec7ef', laces: '#fff' },
      { upper: '#efe2e6', panel: '#e58aa5', sole: '#ffffff', outsole: '#e58aa5', laces: '#fff' },
    ],
  },
  {
    id: 'court-og', name: 'COURT OG', subtitle: 'White / Black', price: 129, shape: 'low',
    colorways: [
      { upper: '#f7f7f5', panel: '#141414', sole: '#f7f7f5', outsole: '#e9dfc9', laces: '#f7f7f5' },
      { upper: '#141414', panel: '#f7f7f5', sole: '#f7f7f5', outsole: '#141414', laces: '#141414' },
    ],
  },
]

// ── Looks (mannequins) ───────────────────────────────────────
// image : '/images/look-1.png' pour remplacer le mannequin dessiné par une vraie photo détourée.
// hotspots : position (en %) des points cliquables sur la silhouette.
export const looks = [
  { id: 'look-1', name: 'Studio Day', skin: '#8d5a3b', hair: '#141110', hairStyle: 'short', glasses: true, top: 'tee-black', bottom: 'jn-light', shoes: 'nova-1' },
  { id: 'look-2', name: 'Weekend Uniform', skin: '#e8c4a6', hair: '#3b2a1e', hairStyle: 'curly', top: 'hd-sage', bottom: 'cg-brown', shoes: 'court-og' },
  { id: 'look-3', name: 'Night Shift', skin: '#5c3a26', hair: '#0f0d0c', hairStyle: 'buzz', top: 'hd-charcoal', bottom: 'tr-black', shoes: 'orbit-low' },
  { id: 'look-4', name: 'Off Duty', skin: '#d9a982', hair: '#1c1714', hairStyle: 'long', top: 'cr-burgundy', bottom: 'cg-grey', shoes: 'drift-3' },
  { id: 'look-5', name: 'Morning Run', skin: '#f0d0b5', hair: '#7a5634', hairStyle: 'short', top: 'tee-sky', bottom: 'jn-mid', shoes: 'vapor-run' },
  { id: 'look-6', name: 'Gallery Walk', skin: '#a26c47', hair: '#141110', hairStyle: 'curly', glasses: true, top: 'jk-navy', bottom: 'jn-raw', shoes: 'halo-mid' },
  { id: 'look-7', name: 'Soft Layers', skin: '#c58e66', hair: '#2a1d14', hairStyle: 'long', top: 'cr-cream', bottom: 'jn-light', shoes: 'pulse-5' },
]

export const byId = (id) =>
  tops.find((p) => p.id === id) || bottoms.find((p) => p.id === id) || sneakers.find((p) => p.id === id)

export const formatPrice = (n) => `${n.toFixed(2).replace('.', ',')} ${BRAND.currency}`
