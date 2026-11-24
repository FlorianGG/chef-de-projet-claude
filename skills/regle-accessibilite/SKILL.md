---
name: regle-accessibilite
description: "Règle n°1 du plugin projet : accessibilité WCAG 2.2 AA — exigences et vérifications. Préchargée dans les agents qui conçoivent, codent, testent ou relisent une interface."
user-invocable: false
---

# Règle n°1 — Accessibilité

Cible : WCAG 2.2 niveau AA. Une interface qui n'est pas accessible n'est pas terminée.

## Exigences

- **Structure** : HTML sémantique d'abord (`button`, `a`, `nav`, `main`, `label`, titres hiérarchisés sans saut). ARIA seulement quand aucun élément natif ne convient.
- **Clavier** : tout ce qui se fait à la souris se fait au clavier ; ordre de tabulation logique ; focus toujours visible ; aucun piège au clavier ; lien « aller au contenu ».
- **Formulaires** : chaque champ a un libellé visible associé ; erreurs annoncées en texte (pas seulement en couleur), liées au champ (`aria-describedby`), et résumées en haut si plusieurs ; `autocomplete` renseigné pour les données personnelles.
- **Contrastes** : 4,5:1 pour le texte, 3:1 pour le grand texte, les icônes et les bordures de composants.
- **Images et icônes** : texte alternatif utile, ou vide si décoratif ; un bouton icône a un nom accessible.
- **Zoom et texte** : utilisable à 200 % de zoom et à 400 % sans défilement horizontal (largeur 320 px).
- **Cibles tactiles** : au moins 24 × 24 px (WCAG 2.2), 44 × 44 px visé sur mobile.
- **Mouvement** : respecter `prefers-reduced-motion` ; pas de contenu qui clignote.
- **Langue** : `lang` sur la page ; messages en français clair.
- **Contenus dynamiques** : changements importants annoncés (`aria-live`) ; une modale piège le focus et le rend à la fermeture.
- **Thème** : couleurs en variables ; mode sombre au même niveau de contraste si proposé.

## Vérifications

- Automatique : axe-core dans les tests de bout en bout sur chaque écran (Playwright + `@axe-core/playwright` côté web), zéro violation « serious » ou « critical ».
- Relecteur accessibilité : ce que les outils ne voient pas (ordre de lecture, pertinence des libellés et des textes alternatifs, parcours clavier complet, annonces).
- Un scénario de bout en bout par parcours principal se joue au clavier seul.
