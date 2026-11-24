# Fin d'étape

Quand toutes les tâches d'une étape sont mergées. Dans l'ordre ; chaque audit peut produire des tâches correctives, rattachées à l'étape suivante (ou à une étape « Corrections » si l'étape suivante n'existe pas), toujours **après accord** de la personne.

Les fichiers produits ici (cahier d'essais, registre RGPD mis à jour, pièges acceptés) partent dans une PR de fin d'étape, branche `etape/<k>`.

## 1. Vérifier

- Toutes les issues de la milestone fermées, toutes les PR mergées.
- Branche principale à jour en local, CI verte sur son dernier commit.
- Projet en ligne : dernier déploiement réussi et URL de vérification OK (`deploiement.md`).

## 2. Essais de l'étape

Lancer `projet:redacteur-essais` en mode étape → `docs/essais/etape-<k>.md`. Proposer à la personne de les dérouler (`essais.md`), en production ou en local. Les KO deviennent des issues `bug`.

## 3. Audit sécurité complet

Avec le skill `security-audit` de Cloudflare, **dans la session principale** (il pilote ses propres agents).

- Absent : expliquer qu'il faut l'installer (commande dans le README du plugin) et proposer de reporter l'audit ; le bilan note « audit sécurité non fait ». Ne pas le remplacer en silence par autre chose.
- Présent : demander un **audit complet** de la branche principale, profil `standard` (`quick` pour une petite étape, `deep` avant une première mise en ligne publique). Sortie hors du dépôt (dossier par défaut du skill).
- Sans bac à sable isolé au niveau du système, il n'exécute pas le code et marque des points `needs_validation` : c'est normal, le dire.
- Présenter les problèmes `confirmed` par gravité, avec le passage de code et pourquoi c'est un problème. Chacun devient une issue (`bug`, `risque:sensible`) après accord. Les `needs_validation` vont au bilan.

## 4. Audit RGPD (si `config.rgpd`)

Lancer `projet:relecteur-rgpd` en mode audit avec `docs/rgpd/registre.md` et `docs/cadrage.md`. Écarts → issues. Le registre mis à jour part dans la PR de fin d'étape. Rappeler que ce n'est pas un avis juridique.

## 5. Accessibilité de l'étape

Si l'étape touche des écrans : `projet:relecteur-accessibilite` en mode audit sur les parcours principaux livrés (parcours complet au clavier, cohérence entre écrans). Écarts → issues.

## 6. Publication (cibles `release` ou `registre`)

Proposer une version et des notes de version (`deploiement.md` → « Publication »). La personne crée et pousse le tag.

## 7. Bilan

`/projet:bilan` (`apprentissage.md`).

## 8. Clore

- Ouvrir la PR de fin d'étape s'il y a des fichiers (cahier d'essais, registre, pièges) ; la personne la merge.
- Fermer la milestone (`gh api -X PATCH repos/<depot>/milestones/<num> -f state=closed`) après accord.
- Journal : `fin_etape`. `etat.json` à jour.
- Résumer : ce qui marche maintenant (et où, si en ligne), ce qui a été trouvé, la prochaine étape.
