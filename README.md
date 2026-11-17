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
