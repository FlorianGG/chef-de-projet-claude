---
name: adopter
description: Installe le plugin dans un projet existant — étude du dépôt, configuration avec les vraies commandes, audits de départ (sécurité, accessibilité, RGPD, tests), plan d'amélioration en issues.
argument-hint: "[objectif : évoluer | sécuriser | accessibilité | rgpd | qualité]"
disable-model-invocation: true
---

# /projet:adopter

Objectif annoncé : $ARGUMENTS (vide = demandé pendant le cadrage léger).

1. Charger le skill `projet:orchestrateur` ; lire `adoption.md`, `github.md`, `mise-en-place.md` (prérequis) et `fin-etape.md` (audits) dans son dossier.
2. Si `.projet/config.json` existe : le projet est déjà adopté, proposer `/projet:etat`. Si le dossier ne contient pas de code : proposer `/projet:nouveau`.
3. Se présenter en deux phrases : tu vas étudier le projet sans rien modifier, poser seulement les questions que l'étude ne tranche pas, puis tout proposer dans une PR qu'elle mergera.
4. Dérouler `adoption.md`.
