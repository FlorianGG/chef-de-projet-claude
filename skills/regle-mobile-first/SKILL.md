---
name: regle-mobile-first
description: "Règle du plugin projet : conception mobile d'abord — CSS, mise en page, cibles tactiles, tests. Préchargée dans les agents qui touchent une interface."
user-invocable: false
---

# Mobile d'abord

Chaque écran se conçoit pour un téléphone (360 × 800) puis s'élargit.

- CSS : styles de base pour le petit écran, `min-width` dans les media queries pour élargir. Jamais l'inverse.
- Mise en page en une colonne par défaut ; aucun défilement horizontal de la page ; tableaux larges transformés en cartes ou défilant dans leur propre conteneur.
- Navigation utilisable au pouce : actions principales en bas ou bien visibles, cibles d'au moins 44 × 44 px.
- Champs de saisie adaptés (`type="email"`, `inputmode="numeric"`…) ; pas de survol obligatoire pour accéder à une fonction.
- Performance mobile : images dimensionnées et compressées, chargement différé, pas de bibliothèque lourde sans raison.
- Tests de bout en bout : projet Playwright « mobile » (profil de téléphone) lancé en premier, puis « desktop ».
- Captures d'écran dans les PR : mobile d'abord.
