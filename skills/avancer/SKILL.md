---
name: avancer
description: Fait avancer le projet d'une tâche — description, tests, code, contrôles, relectures, essais, PR à merger.
argument-hint: "[numéro de tâche]"
disable-model-invocation: true
---

# /projet:avancer

Tâche demandée : $ARGUMENTS (vide = la prochaine tâche de l'étape en cours).

1. Charger le skill `projet:orchestrateur` ; lire `cycle-tache.md` et `github.md` dans son dossier.
2. Lire `.projet/config.json` (absent → proposer `/projet:nouveau`), `.projet/local/etat.json` et l'état GitHub.
3. Si une PR de tâche est déjà ouverte et attend la personne : le rappeler avec son lien avant d'en commencer une autre. Deux tâches en parallèle seulement si elles ne touchent pas les mêmes fichiers et si la personne l'a choisi à l'interview.
4. Dire à la personne quelle tâche démarre, en une phrase.
5. Dérouler le cycle (`cycle-tache.md`) jusqu'à la PR et l'explication pour la relire et la merger.
