---
name: etape
description: Clôt une étape du projet — audit sécurité complet, audit RGPD, audit accessibilité, bilan.
argument-hint: "[nom ou numéro de l'étape]"
disable-model-invocation: true
---

# /projet:etape

Étape : $ARGUMENTS (vide = l'étape en cours).

1. Charger le skill `projet:orchestrateur` ; lire `fin-etape.md`, `apprentissage.md` et `github.md` dans son dossier.
2. Lire `.projet/config.json` et l'état GitHub de la milestone.
3. S'il reste des tâches ouvertes ou des PR non fusionnées : les lister et demander si on clôt quand même (les tâches restantes passent à l'étape suivante) ou si on attend.
4. Dérouler `fin-etape.md`.
