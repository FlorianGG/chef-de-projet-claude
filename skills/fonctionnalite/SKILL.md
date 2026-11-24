---
name: fonctionnalite
description: Ajoute une fonctionnalité à un projet existant — lit le code et les docs, mini-interview, impact technique si besoin, maquette si nouvel écran, découpage en issues.
argument-hint: "\"l'idée de la fonctionnalité\""
disable-model-invocation: true
---

# /projet:fonctionnalite

Idée : $ARGUMENTS

1. Charger le skill `projet:orchestrateur` ; lire `fonctionnalite.md`, `interview.md` et `github.md` dans son dossier.
2. Lire `.projet/config.json` (absent → ce n'est pas un projet du plugin : proposer `/projet:nouveau`).
3. Si l'idée est vide : demander de la décrire en une ou deux phrases, ou de coller le plan préparé ailleurs (chat, notes).
4. Dérouler `fonctionnalite.md`.
