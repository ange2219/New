# Studio Nova — boutique animée « Try the Look »

Site e-commerce mode très animé : mannequins interactifs, portant à vêtements, rotation 360° des produits et carrousel de sneakers en lévitation.

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # version de production dans dist/
```

## Les 3 scènes

| Scène | Ce qui se passe |
|---|---|
| **Looks** | Rangée de mannequins. Au clic, le mannequin vient au centre, les autres s'effacent, le panneau « Dans ce look » s'ouvre avec les pièces portées, des points cliquables et « Ajouter tout le look ». Flèches ← → pour passer d'un look à l'autre. |
| **Collection** | Portant horizontal (glisser ou molette). Les cintres se balancent au survol. Au clic, le vêtement quitte le portant et fait un tour sur lui-même (360°). Boutons Face / Dos / 360°, rotation à la souris ou au doigt, choix de couleur et de taille. |
| **Sneakers** | Chaussures flottantes en diagonale (molette, flèches, glisser). Le nom géant change en fondu. Au clic : fiche produit, coloris, grille de pointures, bouton qui passe au rouge une fois ajouté. |

Panier latéral commun aux 3 scènes. La version mobile est gérée.

## Remplacer les visuels provisoires par tes photos

Tous les visuels actuels sont dessinés en SVG. Pour mettre tes vraies photos :

1. Mets tes images **PNG détourées (fond transparent)** dans `public/images/`.
2. Dans `src/data/catalog.js`, ajoute le chemin sur le produit :

```js
{ id: 'hd-grey', type: 'hoodie', name: 'Heavy Hoodie', price: 95,
  image: '/images/hoodie-gris-face.png',
  imageBack: '/images/hoodie-gris-dos.png' }   // vue de dos pour la rotation
```

- **Mannequins** : `image: '/images/look-1.png'` sur chaque look (photo en pied, détourée, cadrage identique pour tous).
- **Sneakers** : `image` sur chaque coloris (`colorways`), vue de profil, pointe à gauche.

Tout le texte (nom de marque, slogan, mot géant « OBSESSED ») est dans l'objet `BRAND` en haut du même fichier.

## Stack

React 19 · Vite · Framer Motion (transitions partagées `layoutId`, ressorts, rotation 3D CSS).

```
src/
  data/catalog.js        ← produits, looks, marque
  scenes/Looks.jsx       ← scène mannequins
  scenes/Rack.jsx        ← portant + fiche 360°
  scenes/Sneakers.jsx    ← carrousel sneakers + fiche
  components/art/        ← visuels SVG provisoires
  components/Visuals.jsx ← choisit photo réelle ou SVG
  store.jsx              ← panier
```

## Modèles 3D

Les produits marqués **3D** utilisent un vrai modèle `.glb` (dossier `public/models/`), affiché avec
[`<model-viewer>`](https://modelviewer.dev) : rotation, zoom, ombres et coloris intégrés.
Pour ajouter un modèle, mets le fichier dans `public/models/` et ajoute `model: 'models/mon-fichier.glb'` au produit dans `catalog.js`.

Crédits (licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), via [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)) :
- `sneaker-runner.glb` : « Materials Variants Shoe », © 2021 Shopify.
- `sunglasses.glb` : « Sunglasses Khronos », © 2024 Darmstadt Graphics Group GmbH, Eric Chadwick.
- `watch-chrono.glb` : « Chronograph Watch », © 2025 Darmstadt Graphics Group GmbH, Eric Chadwick, d'après « Chronograph Watch Mudmaster » de graphiccompressor.

Les fichiers ont été optimisés (textures WebP 1024 px, géométrie simplifiée pour la montre). Ce sont des modèles de démonstration
(la montre et les lunettes portent le logo Khronos) : à remplacer par tes propres produits avant la mise en vente.
