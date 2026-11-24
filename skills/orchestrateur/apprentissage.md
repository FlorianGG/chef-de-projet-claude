# Apprendre de chaque projet

## Boucle courte (toujours active)

**Journal.** Chaque étape d'une tâche écrit un événement (`fichiers.md`). Les événements `question_personne` et `reponse_personne` mesurent le temps demandé à la personne ; `probleme_tardif` mesure ce qui a échappé aux contrôles et aux relecteurs.

**Fiches de décision.** Toute réponse de la personne qui tranche durablement un choix devient `docs/decisions/NNNN-titre.md` (gabarit : `modeles/decision.md`), versionnée avec la tâche en cours. Le redacteur-spec et les relecteurs les lisent.

**Candidats pièges connus.** Créés sans effort, à chaque fois que :
- le contre-vérificateur confirme un bloquant (`source: contre-verificateur`) ;
- la CI trouve ce que les contrôles locaux n'ont pas vu (`source: ci`) ;
- la personne trouve un problème en essayant (`source: essais`) ;
- une revue humaine relève un bloquant (`source: revue-humaine`).

Pour chacun : dossier `.projet/local/pieges-candidats/<id>/` avec `piege.json` (statut `candidat`), `diff.patch` (`git diff <commit_base> <commit fautif> -- <fichier>`), `spec.md`. Proposer à la personne de les trier avec `/projet:pieges`.

## Le bilan (fin d'étape, ou `/projet:bilan`)

1. Calculer les mesures : `node <plugin>/scripts/mesures.mjs .projet/local/journal.jsonl` (tours moyens par tâche, constats écartés par relecteur, problèmes tardifs par catégorie, questions posées à la personne).
2. Lancer `projet:bilan` avec le rapport de mesures, la liste des pièges acceptés et candidats, et la version du plugin.
3. Il propose **un seul changement**, preuves à l'appui (tâches citées), avec son effet attendu mesurable, et dit à qui il s'adresse :
   - **au projet** (règle du `CLAUDE.md` du projet, contrôle ajouté dans `config.controles`, chemin sensible ajouté) → PR dans le dépôt du projet ;
   - **au plugin** (consigne d'un agent, règle générale, piège général) → PR sur le dépôt du plugin : cloner le dépôt du plugin dans un dossier temporaire, branche `bilan/<projet>-<date>`, PR. Jamais d'écriture dans le plugin installé.
4. La personne valide ou refuse. Un **assouplissement** (retirer un contrôle, un relecteur, augmenter les tours) exige une justification écrite dans la PR.

Repères pour le bilan :
- un relecteur dont beaucoup de constats sont écartés → resserrer sa consigne ;
- un relecteur muet alors que des problèmes de sa catégorie arrivent tard → élargir son périmètre ;
- un constat trouvé souvent par un relecteur IA → le transformer en contrôle automatique (moins cher, sans faux positif) ;
- un piège présent dans deux projets différents → proposer de le remonter au plugin (`portee: general`).

## Pièges connus (`/projet:pieges`)

- `lister` : candidats et acceptés.
- `trier` : pour chaque candidat, montrer ce qui s'est passé (extrait de code compris) ; la personne accepte ou refuse. Accepté et `portee: projet` → déplacé dans `.projet/pieges/` (versionné avec la prochaine PR). Accepté et `portee: general` → proposé au dépôt du plugin dans `pieges/` (PR). Refusé → supprimé.
- `rejouer` : boucle longue, voir plus bas.

Taille : 50 pièges au plus par projet, et un quota par relecteur ; les plus anciens ou redondants sortent.

## Boucle longue (à partir d'une vingtaine de pièges acceptés)

`/projet:pieges rejouer` vérifie que les relecteurs actuels trouvent toujours les pièges connus :

1. Pour chaque piège : créer un worktree temporaire sur `commit_base`, appliquer `diff.patch`.
2. Lancer le relecteur concerné avec le diff et `spec.md`, **trois fois**, chaque fois dans un contexte neuf. Enregistrer chaque JSON rendu dans `.projet/local/rejeu/<id>/<essai>.json` (essai = 1, 2, 3).
3. `node <plugin>/scripts/rejouer-pieges.mjs .projet/pieges .projet/local/rejeu --sortie .projet/local/rejeu/rapport-<date>.json [--comparer <rapport précédent>]` : un piège est trouvé si un constat tombe dans le bon fichier, recoupe la plage de lignes, avec la bonne catégorie. Pas de juge IA.
4. Rapport : taux de détection par relecteur. Avant d'adopter une nouvelle version d'un relecteur (PR sur le plugin), ce taux ne doit pas baisser ; un piège trouvé avant et raté après bloque l'adoption.
5. Supprimer les worktrees temporaires.

Avant le seuil d'une vingtaine de pièges, ne pas tirer de conclusion de ces taux : le dire.

## Modèles de projet

Quand une étape est terminée sur une stack, contrôles verts, sans problème tardif sur la mise en place : le bilan peut proposer de figer cette stack en modèle dans le plugin (`modeles/<stack>/` : générateurs utilisés et leurs options, versions, fichiers de configuration, CI, `config.json` de départ). Proposition de modification sur le dépôt du plugin, comme tout le reste.
