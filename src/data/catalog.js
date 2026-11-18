// ─────────────────────────────────────────────────────────────
//  CATALOGUE — c'est ici que tu modifies tes produits.
//
//  Photos détourées (fond transparent) :
//    public/looks/     → mannequins de la cabine (toile 640 × 1500, pieds en bas)
//    public/products/  → une image par produit
//  Les noms et les prix sont provisoires : change-les librement ici.
// ─────────────────────────────────────────────────────────────

export const BRAND = {
  name: 'STUDIO NOVA',
  currency: '€',
  tagline: 'Try the Look.',
  bigWord: 'OBSESSED',
}

export const SIZES_CLOTHES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
export const SIZES_SHOES = ['38', '39', '40', '40.5', '41', '42', '42.5', '43', '44', '44.5', '45', '46']
export const SIZES_RINGS = ['50', '52', '54', '56', '58', '60', '62']

const img = (id) => `products/${id}.webp`

// ── Hauts ────────────────────────────────────────────────────
export const TOP_TYPES = { tee: 'T-shirt', shirt: 'Chemise', overshirt: 'Surchemise', polo: 'Polo', knit: 'Maille', vest: 'Gilet' }
export const tops = [
  { id: 'overshirt-brooklyn', type: 'overshirt', name: 'Surchemise Brooklyn 92', subtitle: 'Sauge · broderie jaune', price: 89 },
  { id: 'polo-arodr', type: 'polo', name: 'Polo Arodr', subtitle: 'Bordeaux · col vert', price: 85 },
  { id: 'zip-knit-charcoal', type: 'knit', name: 'Gilet zippé côtelé', subtitle: 'Anthracite', price: 129 },
  { id: 'vest-chocolate', type: 'vest', name: 'Gilet de costume', subtitle: 'Chocolat', price: 99 },
  { id: 'tee-essential-black', type: 'tee', name: 'Essential Tee', subtitle: 'Noir', price: 39 },
  { id: 'shirt-stripe-ss', type: 'shirt', name: 'Chemise rayée manches courtes', subtitle: 'Écru', price: 69 },
  { id: 'shirt-oxford-white', type: 'shirt', name: 'Chemise Oxford', subtitle: 'Blanc', price: 79 },
  { id: 'tee-ls-white', type: 'tee', name: 'T-shirt manches longues', subtitle: 'Blanc', price: 45 },
  { id: 'tee-white', type: 'tee', name: 'T-shirt ajusté', subtitle: 'Blanc', price: 35 },
].map((p) => ({ ...p, category: 'top', image: img(p.id) }))

// ── Bas ──────────────────────────────────────────────────────
export const bottoms = [
  { id: 'trouser-pleat-black', name: 'Pantalon large à pinces', subtitle: 'Noir', price: 119 },
  { id: 'trouser-pinstripe', name: 'Pantalon à fines rayures', subtitle: 'Anthracite', price: 129 },
  { id: 'trouser-wide-brown', name: 'Pantalon large en laine', subtitle: 'Taupe', price: 125 },
  { id: 'jeans-washed-beige', name: 'Jean baggy délavé', subtitle: 'Beige', price: 110 },
  { id: 'trouser-wide-black', name: 'Pantalon palazzo', subtitle: 'Noir', price: 115 },
  { id: 'trouser-chino-wide', name: 'Chino large', subtitle: 'Sable', price: 105 },
].map((p) => ({ ...p, type: 'pants', category: 'bottom', image: img(p.id) }))

// ── Chaussures (page « Chaussures ») ─────────────────────────
const shoe = (id, name, subtitle, price) => ({ id, name, subtitle, price, category: 'shoes', image: img(id), colorways: [{ label: subtitle }] })
export const sneakers = [
  shoe('derby-two-tone', 'DERBY BICOLORE', 'Noir & blanc', 159),
  shoe('boots-tan', 'WORK BOOTS', 'Nubuck camel', 179),
  shoe('loafer-two-tone', 'MOCASSIN BICOLORE', 'Chocolat & crème', 155),
  shoe('derby-massive', 'DERBY MASSIVE', 'Cuir noir', 149),
  shoe('loafer-chunky', 'MOCASSIN CRANTÉ', 'Cuir noir', 149),
  shoe('derby-classic', 'DERBY CLASSIQUE', 'Cuir verni noir', 139),
  {
    category: 'shoes',
    id: 'runner-3d', name: 'NOVA RUNNER', subtitle: 'Running · 3 coloris · 3D', price: 199, shape: 'low',
    model: 'models/sneaker-runner.glb', cameraOrbit: '180deg 75deg 72%',
    credit: 'Modèle 3D © 2021 Shopify, CC BY 4.0 (Khronos glTF Sample Assets)',
    colorways: [
      { variant: 'midnight', label: 'Midnight', upper: '#2a3654', panel: '#111', sole: '#f2f2f2', outsole: '#1b1b1b', laces: '#eee' },
      { variant: 'beach', label: 'Beach', upper: '#e8d9b8', panel: '#c96f4a', sole: '#f6f1e6', outsole: '#b98d55', laces: '#fff' },
      { variant: 'street', label: 'Street', upper: '#3b3f46', panel: '#d7262d', sole: '#f2f2f2', outsole: '#2a2a2a', laces: '#222' },
    ],
  },
]

// ── Accessoires ──────────────────────────────────────────────
export const ACC_TYPES = {
  glasses: 'Lunettes',
  beanie: 'Bonnet',
  cap: 'Casquette',
  hat: 'Béret',
  chain: 'Collier',
  watch: 'Montre',
  bracelet: 'Bracelet',
  tie: 'Cravate',
  belt: 'Ceinture',
  walletchain: 'Chaîne de pantalon',
  bag: 'Sac',
  scarf: 'Foulard',
  gloves: 'Gants',
}
export const ACC_PLURAL = {
  glasses: 'Lunettes',
  beanie: 'Bonnets',
  cap: 'Casquettes',
  hat: 'Bérets',
  chain: 'Colliers',
  watch: 'Montres',
  bracelet: 'Bracelets',
  tie: 'Cravates',
  belt: 'Ceintures',
  walletchain: 'Chaînes de pantalon',
  bag: 'Sacs',
  scarf: 'Foulards',
  gloves: 'Gants',
}

const acc = (id, type, name, subtitle, price) => ({ id, type, name, subtitle, price, category: 'accessory', image: img(id) })
export const accessories = [
  acc('shade-round', 'glasses', 'Shade Round', 'Acétate noir · verres fumés', 79),
  acc('shade-amber', 'glasses', 'Shade Amber', 'Noir · verres ambrés', 89),
  acc('shade-square', 'glasses', 'Shade Square', 'Acétate noir', 79),
  acc('shade-wayfarer', 'glasses', 'Shade Classic', 'Acétate noir', 85),
  acc('beanie-88', 'beanie', 'Bonnet 88', 'Noir · broderie blanche', 35),
  acc('beanie-bordeaux', 'beanie', 'Bonnet docker', 'Bordeaux', 32),
  acc('cap-black', 'cap', 'Casquette', 'Coton noir', 35),
  acc('cap-trucker-brown', 'cap', 'Casquette trucker', 'Chocolat & crème', 39),
  acc('beret-leather', 'hat', 'Béret en cuir', 'Noir', 59),
  acc('chain-forcat', 'chain', 'Chaîne forçat', 'Argent', 89),
  acc('chain-gold-rope', 'chain', 'Chaîne fine', 'Doré', 95),
  acc('cross-gold', 'chain', 'Collier croix', 'Doré', 79),
  acc('necklace-tag', 'chain', 'Collier plaque', 'Argent', 69),
  acc('watch-steel-diver', 'watch', 'Montre Diver', 'Acier · cadran noir', 229),
  acc('watch-onyx', 'watch', 'Montre Onyx', 'Acier noir', 179),
  acc('watch-gold', 'watch', 'Montre Classic', 'Doré · cadran blanc', 199),
  acc('bracelet-gold-curb', 'bracelet', 'Bracelet gourmette', 'Doré', 59),
  acc('tie-black', 'tie', 'Cravate fine', 'Noir', 39),
  acc('belt-black', 'belt', 'Ceinture cuir', 'Noir · boucle argent', 55),
  acc('belt-brown', 'belt', 'Ceinture cuir', 'Chocolat · boucle argent', 55),
  acc('wallet-chain-double', 'walletchain', 'Chaîne de pantalon double', 'Argent', 45),
  acc('wallet-chain-curb', 'walletchain', 'Chaîne de pantalon gourmette', 'Argent', 39),
  acc('wallet-chain-padlock', 'walletchain', 'Chaîne de pantalon cadenas', 'Argent', 49),
  acc('bag-woven', 'bag', 'Sac bandoulière tressé', 'Cuir sable', 149),
  acc('scarf-monogram', 'scarf', 'Foulard en soie', 'Chocolat · motif', 69),
  acc('gloves-leather', 'gloves', 'Gants en cuir', 'Chocolat', 65),
  {
    id: 'gl-3d', type: 'glasses', name: 'Shade Lab', subtitle: 'Modèle 3D · verres irisés', price: 119, color: '#1c1c1c', lens: '#2c3a46',
    model: 'models/sunglasses.glb', cameraOrbit: '0deg 80deg 110%',
    credit: 'Modèle 3D © 2024 Darmstadt Graphics Group, Eric Chadwick, CC BY 4.0 (Khronos glTF Sample Assets)',
  },
  {
    id: 'wt-chrono', type: 'watch', name: 'Chronographe', subtitle: 'Modèle 3D · 4 cadrans', price: 249, color: '#c4c7cc', dial: '#f2f2f2', strap: '#2a2a2a',
    model: 'models/watch-chrono.glb', cameraOrbit: '0deg 75deg 105%',
    variants: [
      { variant: 'Surgical White', label: 'Blanc', color: '#f2f2f2' },
      { variant: 'Midnight Gold', label: 'Nuit & or', color: '#1c1f2b' },
      { variant: 'Commerce Green', label: 'Vert', color: '#2f6b4a' },
      { variant: 'Khronos Red', label: 'Rouge', color: '#c8322f' },
    ],
    credit: 'Modèle 3D © 2025 Darmstadt Graphics Group, Eric Chadwick, d’après graphiccompressor, CC BY 4.0 (Khronos glTF Sample Assets)',
  },
]

// ── Looks de la cabine ───────────────────────────────────────
// image : silhouette détourée (public/looks/)
// items : pièces portées, avec la position (en %) de leur point cliquable sur la silhouette
export const LOOK_RATIO = 640 / 1500
export const looks = [
  {
    id: 'look-all-black', name: 'All Black', image: 'looks/look-all-black.webp',
    items: [
      { id: 'beanie-88', x: 52, y: 6 }, { id: 'shade-round', x: 46, y: 11.5 }, { id: 'chain-forcat', x: 56, y: 18.5 },
      { id: 'tee-essential-black', x: 36, y: 23 }, { id: 'watch-onyx', x: 64, y: 31 }, { id: 'trouser-pleat-black', x: 50, y: 62 },
      { id: 'derby-massive', x: 25, y: 96 },
    ],
  },
  {
    id: 'look-office-knit', name: 'Office Knit', image: 'looks/look-office-knit.webp',
    items: [
      { id: 'shade-square', x: 54, y: 10 }, { id: 'tie-black', x: 47.5, y: 21 }, { id: 'zip-knit-charcoal', x: 63, y: 30 },
      { id: 'shirt-oxford-white', x: 27, y: 43 }, { id: 'wallet-chain-double', x: 29, y: 50 }, { id: 'watch-steel-diver', x: 69, y: 44 },
      { id: 'trouser-pinstripe', x: 55, y: 68 }, { id: 'derby-classic', x: 29, y: 96 },
    ],
  },
  {
    id: 'look-chocolate', name: 'Chocolate', image: 'looks/look-chocolate.webp',
    items: [
      { id: 'beanie-bordeaux', x: 52, y: 6.5 }, { id: 'cross-gold', x: 54, y: 20 }, { id: 'shirt-stripe-ss', x: 24, y: 26 },
      { id: 'vest-chocolate', x: 62, y: 30 }, { id: 'watch-steel-diver', x: 78, y: 42 }, { id: 'wallet-chain-curb', x: 68, y: 47.5 },
      { id: 'trouser-wide-brown', x: 50, y: 66 }, { id: 'derby-two-tone', x: 44, y: 93 },
    ],
  },
  {
    id: 'look-brooklyn', name: 'Brooklyn 92', image: 'looks/look-brooklyn.webp',
    items: [
      { id: 'cap-black', x: 49, y: 6 }, { id: 'chain-gold-rope', x: 46, y: 19.5 }, { id: 'bracelet-gold-curb', x: 23, y: 25 },
      { id: 'overshirt-brooklyn', x: 70, y: 32 }, { id: 'tee-ls-white', x: 43, y: 43 }, { id: 'watch-gold', x: 68, y: 46 },
      { id: 'jeans-washed-beige', x: 50, y: 66 }, { id: 'boots-tan', x: 27, y: 95 },
    ],
  },
  {
    id: 'look-arodr', name: 'Arodr Club', image: 'looks/look-arodr.webp',
    items: [
      { id: 'beret-leather', x: 58, y: 5.5 }, { id: 'shade-amber', x: 57, y: 12 }, { id: 'watch-steel-diver', x: 70, y: 22 },
      { id: 'polo-arodr', x: 42, y: 29 }, { id: 'belt-black', x: 53, y: 42 }, { id: 'wallet-chain-padlock', x: 36, y: 48 },
      { id: 'trouser-wide-black', x: 60, y: 66 }, { id: 'loafer-chunky', x: 27, y: 96 },
    ],
  },
  {
    id: 'look-riviera', name: 'Riviera', image: 'looks/look-riviera.webp',
    items: [
      { id: 'cap-trucker-brown', x: 44, y: 9 }, { id: 'shade-wayfarer', x: 53, y: 14.5 }, { id: 'gloves-leather', x: 27, y: 19 },
      { id: 'watch-steel-diver', x: 63, y: 21 }, { id: 'necklace-tag', x: 47, y: 23.5 }, { id: 'tee-white', x: 38, y: 28 },
      { id: 'bag-woven', x: 70, y: 34 }, { id: 'scarf-monogram', x: 53, y: 38 }, { id: 'belt-brown', x: 42, y: 36.5 },
      { id: 'trouser-chino-wide', x: 45, y: 62 }, { id: 'loafer-two-tone', x: 64, y: 96 },
    ],
  },
]

export const allProducts = [...tops, ...bottoms, ...sneakers, ...accessories]
export const byId = (id) => allProducts.find((p) => p.id === id)

// Libellé de catégorie d'un produit (pour les panneaux et le panier)
export const categoryLabel = (p) =>
  p.category === 'top' ? TOP_TYPES[p.type] || 'Haut' : p.category === 'bottom' ? 'Pantalon' : p.category === 'shoes' ? 'Chaussures' : ACC_TYPES[p.type] || 'Accessoire'

export const formatPrice = (n) => `${n.toFixed(2).replace('.', ',')} ${BRAND.currency}`
