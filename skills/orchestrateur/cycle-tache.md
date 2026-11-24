# Cycle d'une tâche

`<plugin>` = racine du plugin ; `<t>` = `.projet/local/taches/<n>/` (local) ; `<verrou>` = `.projet/verrous/tache-<n>.sha256` (versionné). Chaque étape ajoute un événement au journal :

```
node <plugin>/scripts/journal.mjs <n> <evenement> '<json details>'
```

## 0. Préparer

- Choisir la tâche : celle donnée par la personne, sinon la prochaine tâche ouverte de l'étape en cours, dans l'ordre du découpage (`github.md`).
- Niveau de confiance : 2 requis pour produire. Niveau 1 : seulement relire une PR existante (étapes 7 et 8). Niveau 0 : rien.
- Mettre à jour la branche principale, créer la branche `tache/<n>-<court-titre>`, label `en-cours` sur l'issue.

## 1. Tri

1. Lire l'issue (critères `CA-<n>-<k>`, scénarios, `nouvel_ecran`).
2. Estimer les fichiers concernés, puis :
   ```
   node <plugin>/scripts/niveau-risque.mjs --fichiers <f1> <f2> ...
   ```
   Le script rend le niveau plancher, les raisons et les indicateurs (`interface`, `donnees_perso`). Tu peux **monter** le niveau, jamais le descendre.
3. Relecteurs : `code` toujours ; `securite` si niveau ≥ normal ; `accessibilite` si l'interface est touchée ; `rgpd` si `config.rgpd` et données personnelles touchées. Justifier chaque activation.
4. Écrire `<t>/tri.json` (`fichiers.md`). Mettre le label `risque:<niveau>` sur l'issue.

Après le code (étape 5), relancer le script avec `--depuis <branche_principale>` : si le niveau réel est plus haut, mettre à jour le tri et ajouter les relecteurs manquants.

## 2. Description de ce qu'on va faire

Lancer `projet:redacteur-spec` avec : l'issue, `docs/cadrage.md`, `docs/architecture.md`, `docs/decisions/`, `docs/maquettes/ecrans.md`, `.projet/pieges/`. Il écrit `<t>/spec.md`.

- Questions ouvertes, ou niveau sensible : présenter la description à la personne et obtenir sa validation. Ses réponses vont dans la spec ; une décision durable devient une fiche de décision (`modeles/decision.md`).
- Sinon : continuer.

## 3. Maquette (si `nouvel_ecran` et maquettes choisies)

Lancer `projet:designer` avec la spec et `docs/maquettes/`. Montrer la maquette à la personne (vue téléphone puis ordinateur) ; ajuster jusqu'à son accord. La maquette devient une entrée du testeur et du codeur, et fait partie de la PR.

## 4. Tests avant le code

Selon `config.tests`. Lancer `projet:testeur` avec `<t>/spec.md`, l'architecture, la maquette éventuelle et la liste des fichiers de test existants. Il écrit les tests (rouges) et rend la liste des fichiers.

Vérifier qu'ils échouent pour la bonne raison (fonctionnalité absente, pas erreur de syntaxe), puis verrouiller et committer tests + verrou ensemble :

```
node <plugin>/scripts/verrou-tests.mjs sceller <verrou> <fichiers de test...>
git add <fichiers de test> <verrou> && git commit -m "Add failing tests for #<n>"
```

Tâche sans code testable (documentation, configuration pure) : `tests: aucun` dans `tri.json`, avec la raison.

## 5. Code

Lancer `projet:codeur` **avec un contexte neuf** : `<t>/spec.md`, la liste des tests verrouillés, la maquette éventuelle, `CLAUDE.md`, l'architecture, et au tour 2+ `<t>/constats-confirmes.json` et l'extrait en échec de `<t>/controles.json`. Rien d'autre.

Si le codeur conteste un test : ne pas le laisser le modifier. Contestation fondée (test faux par rapport à la spec) → relancer le testeur sur ce point, re-sceller, committer avec un message qui le dit. Noter l'événement.

## 6. Contrôles automatiques

```
node <plugin>/scripts/verrou-tests.mjs verifier <verrou>
node <plugin>/scripts/controles.mjs --sortie <t>/controles.json
```

Arrêt au premier échec ; retour à l'étape 5 avec **seulement** le contrôle fautif et la fin de son journal. Rien ne part en relecture sur du rouge.

## 7. Relectures, en parallèle

`git diff <branche_principale>...HEAD > <t>/diff.patch`. Lancer en même temps les relecteurs retenus, chacun avec `<t>/diff.patch`, `<t>/spec.md`, `<t>/controles.json` (et les captures / la maquette pour l'accessibilité). Ils sont en lecture seule et rendent leur JSON, enregistré tel quel dans `<t>/constats/<relecteur>.json` (JSON invalide → relancer une fois). Un événement `relecture` par relecteur.

Sécurité : `/security-review` (outil Skill, `security-review`) sur la branche, rapport converti en `<t>/constats/securite.json` (même format ; un point sans fichier ni ligne reste `important`).

En parallèle des relectures : lancer `projet:redacteur-essais` (mode tâche) → `<t>/essais.md`.

## 8. Contre-vérification — seulement s'il y a des bloquants ou des importants

Lancer `projet:contre-verificateur` avec les constats, la spec et le diff. Enregistrer son JSON dans `<t>/constats-confirmes.json`.

- Confirmés → étape 5 (tour suivant, événement `tour`), puis contrôles, puis **seuls les relecteurs concernés** relisent **seulement les passages modifiés**.
- Remet la spec en cause → étape 2.
- Chaque bloquant confirmé devient un **candidat piège connu** (`apprentissage.md`).

Limite : `config.limites.tours_correction` (3 par défaut). Un bloquant encore là au deuxième tour remonte à la personne avec les options et ta recommandation.

## 9. PR

1. Commits sur la branche (anglais, impératif, citant `#<n>`).
2. Captures si interface : téléphone puis ordinateur (Playwright ou navigateur intégré).
3. Lancer `projet:redacteur-pr` → `<t>/pr.md` (il reprend `<t>/essais.md`).
4. Push et `gh pr create` (`github.md`), avec l'accord de la personne ou son accord global (`accords.json`). Retirer `en-cours`.
5. Attendre la CI. Rouge alors que les contrôles locaux étaient verts → étape 5 et événement `probleme_tardif` (`source: ci`).

## 10. Validation

Dire à la personne : ce qui a été fait, comment l'essayer (essais), où regarder en priorité dans le code, ce que disent les relecteurs. Niveau sensible : demander une vraie relecture du code, pas un merge rapide. **Elle merge, jamais l'agent.**

Proposer de dérouler les essais avec elle (`/projet:essais <n>`) avant le merge. Un essai en échec → retour à l'étape 5 si la tâche est encore ouverte.

Après le merge (vérifié par `gh pr view`) : `pr_validee`, issue fermée, `etat.json` à jour. Si le projet est mis en ligne : suivre le déploiement (`deploiement.md` → « Après chaque merge »). Dernière tâche de l'étape → proposer `/projet:etape`.

Un problème trouvé plus tard par la personne → nouvelle issue (label `bug`), événement `probleme_tardif` (`source: essais`), candidat piège connu.
