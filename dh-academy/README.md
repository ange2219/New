# DH ACADEMY — site vitrine

Site statique (HTML / CSS / JS), sans étape de build.

- **Animations** : GSAP 3.13 + ScrollTrigger + SplitText, défilement fluide Lenis (fichiers dans `assets/vendor/`, aucun CDN requis).
- **Direction artistique** : studio blanc, encre noire, une seule marque bleue (`#146ef5`), police Inter.
- **Accessibilité** : si l'utilisateur a activé « réduire les animations », tout le contenu s'affiche sans animation.

## Voir le site en local

```bash
cd dh-academy
python3 -m http.server 8000   # puis http://localhost:8000
```

## Structure

```
index.html            ← page d'accueil (toutes les sections)
assets/css/style.css  ← tokens du style guide + mise en page responsive
assets/js/main.js     ← toutes les animations GSAP
assets/vendor/        ← gsap, ScrollTrigger, SplitText, Lenis
```

## À compléter

- Lien d'accès à la formation : les boutons « Rejoindre la formation » mènent pour l'instant à la section Contact / WhatsApp.
- Email : affiché « Bientôt disponible ».
