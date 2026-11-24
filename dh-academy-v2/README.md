# DH ACADEMY — version sombre « blue hour »

Site statique (HTML / CSS / JS), sans étape de build.

- **Direction artistique** : toile onyx `#171721`, cartes graphite `#1e1e2a`, texte ivoire, une seule couleur d'action (cobalt `#5266eb`) réservée à « Recevoir le lien d'accès » / « Rejoindre ». Boutons et champs en pilule, cartes à 12 px, aucune ombre.
- **Typo** : Archivo élargi (graisse 480) pour les titres, Inter pour le texte (Google Fonts).
- **Animations** : GSAP 3.13 + ScrollTrigger + SplitText, défilement fluide Lenis (`assets/vendor/`).
- **Photos** : chargées depuis Unsplash (placeholders). Si une photo ne charge pas, un fond dégradé prend le relais.
- **Réalisations** : trois emplacements vidéo prêts. Mets tes fichiers dans `assets/videos/` et remplace chaque bloc `.work__empty` par la balise `<video>` indiquée en commentaire.
- **Formulaires** : le prénom saisi ouvre une conversation WhatsApp pré-remplie vers le +229 01 99 56 37 85.

## Voir le site en local

```bash
cd dh-academy-v2
python3 -m http.server 8000   # puis http://localhost:8000
```
