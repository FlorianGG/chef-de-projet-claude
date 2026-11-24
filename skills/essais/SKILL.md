---
name: essais
description: Déroule les essais manuels d'une tâche ou d'une étape avec la personne, un par un, et transforme les échecs en bugs.
argument-hint: "[n° de tâche | etape <k>]"
disable-model-invocation: true
---

# /projet:essais

Cible : $ARGUMENTS (vide = la dernière PR ouverte, sinon le cahier de l'étape en cours).

1. Charger le skill `projet:orchestrateur` ; lire `essais.md` dans son dossier.
2. Si les essais de la cible n'existent pas encore : lancer `projet:redacteur-essais` (mode tâche ou étape) pour les écrire.
3. Dérouler `essais.md` → « Dérouler ».
