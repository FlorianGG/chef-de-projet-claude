# Scénarios

Trois façons d'utiliser le plugin, du premier message à la dernière PR. Chacune montre qui fait quoi entre :

- **le chat** — une conversation ou un projet sur claude.ai (web, bureau, téléphone) : pour réfléchir, chercher, comparer ;
- **Claude Code** — une session Code (application de bureau, terminal, VS Code) avec le plugin `projet` : pour décider sur le vrai dépôt et faire ;
- **GitHub** — le dépôt, ses issues, ses PR, sa CI : la seule source de vérité ;
- **toi** — tu réponds aux questions, tu valides, tu essaies, tu merges.

Règle commune : **le chat réfléchit, le dépôt décide, Claude Code exécute.** Ce qui est décidé dans le chat finit toujours dans le dépôt (issue, fiche de décision, cadrage) ; le projet du chat n'est jamais la référence.

---

## Scénario 1 — D'une idée floue à la fin du développement

> « J'aimerais une appli pour que les bénévoles de mon asso s'inscrivent aux créneaux de distribution. »

### 1. Dégrossir l'idée — chat (facultatif)

Tant que l'idée est floue, le chat est le bon endroit : tu peux y penser depuis ton téléphone, chercher ce qui existe, comparer des approches, sans consommer de session Claude Code.

| Qui | Quoi |
| --- | --- |
| toi → chat | tu décris l'idée, tu poses tes questions (« ça existe déjà ? », « web ou appli ? ») |
| chat | t'aide à préciser : utilisateurs, besoins, contraintes, sources (sites, vidéos de démo) |
| toi | tu repars avec un résumé de quelques lignes — **pas** d'issues à ce stade : il n'y a pas encore de dépôt ni de stack |

### 2. Lancer le projet — GitHub puis Claude Code

| Qui | Quoi |
| --- | --- |
| toi → GitHub | tu crées un dépôt vide (sans README ni licence) |
| toi → Claude Code | dans un dossier vide : `/projet:nouveau "…"` en collant le résumé du chat |
| Claude Code | vérifie git, `gh`, Node ; reformule l'idée et attend ton « oui » |
| Claude Code ↔ toi | interview par petits paquets de questions : utilisateurs, parcours principaux, forme (web, mobile…), **suite** (en ligne, local, publication), stockage, données personnelles, technos préférées, tests back / front / bout en bout, maquettes |
| architecte | **verdict de faisabilité** : GO / GO avec réserves / NO-GO, coût mensuel sourcé, nombre d'étapes, risques |
| toi | tu acceptes ou refuses chaque réserve |
| architecte | stack, architecture, plan de mise en ligne, fiches de décision — expliqués (pourquoi, alternative écartée) |
| designer | direction visuelle (palette, typos, contrastes AA vérifiés) puis maquettes HTML des parcours, téléphone d'abord |
| toi | tu valides la direction et les maquettes dans le navigateur |
| découpeur → GitHub | étapes (milestones) et issues avec critères `CA-n-k`, après ton accord |
| Claude Code → GitHub | tâche n°1 « Mise en place » : squelette par les générateurs officiels, CI, vérification des verrous de tests, modèle d'issue, `CLAUDE.md` → **PR** |
| toi → GitHub | tu relis et tu **merges** |

### 3. Développer — Claude Code, une tâche à la fois

`/projet:avancer` (ou `/projet:avancer 7`) :

```
description de la tâche ─► maquette si nouvel écran ─► tests écrits et verrouillés
   ─► code (contexte neuf) ─► contrôles automatiques ─► relectures en parallèle
   (code · accessibilité · sécurité · RGPD si données) ─► contre-vérification
   ─► essais ─► PR « ce qui change · où regarder · ce qui a été vérifié »
```

| Qui | Quoi |
| --- | --- |
| toi | tu réponds aux questions de la description si elle en a, tu valides la maquette |
| Claude Code | fait tout le reste, s'arrête au premier contrôle rouge, corrige au plus 3 tours, te remonte un blocage qui persiste |
| toi | `/projet:essais` : tu déroules les essais un par un (✅ / ❌) ; un ❌ repart en correction |
| toi → GitHub | tu relis les passages signalés « où regarder » et tu **merges** |
| Claude Code | si le projet est en ligne : suit le déploiement, vérifie l'URL ; un échec devient un bug |

Entre deux tâches, tu peux revenir au chat pour réfléchir à la suite ; ce qui en sort revient dans le dépôt par une issue (modèle `.github/ISSUE_TEMPLATE/tache.md`) ou par `/projet:fonctionnalite`.

### 4. Clore chaque étape — Claude Code

`/projet:etape` : essais de l'étape, **audit de sécurité complet** (skill Cloudflare), audit accessibilité, audit RGPD si données, publication si besoin, puis **bilan** — un seul changement proposé, au projet ou au plugin, que tu acceptes ou non.

### 5. Fin

Quand la dernière étape est close : le projet est en ligne (ou publié), documenté (`docs/`), testé, audité, et chaque décision a sa fiche. Le journal local et les pièges connus servent au projet suivant.

---

## Scénario 2 — Un projet existant à améliorer et sécuriser

> « J'ai une appli React + API Node faite il y a un an, sans tests front, je ne suis pas sûr de la sécurité et ça s'affiche mal sur téléphone. »

### 1. Préparer — chat (facultatif)

| Qui | Quoi |
| --- | --- |
| toi → chat | tu listes ce qui t'inquiète, les plaintes des utilisateurs, les priorités |
| chat | t'aide à hiérarchiser ; **il ne voit pas le code** : ses avis restent des hypothèses |

### 2. Adopter — Claude Code

| Qui | Quoi |
| --- | --- |
| toi → Claude Code | à la racine du dépôt, arbre de travail propre : `/projet:adopter sécuriser` |
| analyste-projet | étudie le dépôt **sans rien modifier** : stack, commandes de la CI, tests, conventions, interface (mobile d'abord ou non), données personnelles, zones sensibles, issues ouvertes ; rétro-documente l'architecture, chaque point sourcé `fichier:ligne` |
| Claude Code → toi | résumé de l'état de santé, signalements (un secret versionné se traite tout de suite : tu le révoques), puis seulement les questions que l'étude n'a pas tranchées |
| toi | objectif de l'adoption, parcours principaux, ce qui ne doit pas bouger, niveau de confiance (2 si tu es seul, 1 si d'autres ouvrent des PR) |
| Claude Code → GitHub | **PR d'adoption** : `.projet/config.json` avec les vraies commandes de ta CI (lancées une fois avec toi), `docs/architecture.md`, section « Plugin projet » ajoutée à ton `CLAUDE.md` (pas remplacé), workflow **séparé** pour les verrous de tests (ta CI n'est pas touchée), modèle d'issue, labels |
| toi → GitHub | tu relis et tu **merges** |

### 3. Audits de départ — Claude Code

| Audit | Résultat |
| --- | --- |
| sécurité (skill Cloudflare) | problèmes confirmés avec le passage de code et pourquoi c'est un problème |
| accessibilité et mobile d'abord | parcours impraticables au clavier ou sur téléphone |
| RGPD (si données personnelles) | registre pré-rempli, écarts |
| tests | zones critiques sans test |

### 4. Plan d'amélioration — Claude Code → GitHub

Le découpeur propose une ou plusieurs étapes « Mise à niveau », dans cet ordre : ce qui est grave et exploitable → ce qui bloque des utilisateurs → **tests sur les zones critiques avant d'y toucher** → le reste en petites tâches. Après ton accord, issues créées.

Le code existant n'est pas réécrit d'un coup : les règles (accessibilité, mobile d'abord, tests avant le code) s'appliquent à tout code **nouveau ou modifié** ; l'existant est repris par les tâches que tu choisis.

### 5. Ensuite

Comme le scénario 1, étape 3 : `/projet:avancer` sur chaque tâche, tu merges, `/projet:etape` à la fin de chaque étape de mise à niveau. Tes issues déjà ouvertes ne sont pas réécrites en masse : chacune est complétée au moment où on la traite.

---

## Scénario 3 — Une nouvelle fonctionnalité

> « Je voudrais que les bénévoles reçoivent un rappel la veille de leur créneau. »

### Cas A — le projet utilise déjà le plugin

Deux chemins, selon où tu en es dans ta réflexion.

**A1. L'idée est claire → directement dans Claude Code (recommandé)**

| Qui | Quoi |
| --- | --- |
| toi → Claude Code | `/projet:fonctionnalite "rappel la veille du créneau"` |
| Claude Code | lit le cadrage, les décisions, les issues ouvertes ; fait explorer le code concerné ; signale si ça existe déjà en partie |
| Claude Code ↔ toi | mini-interview : canal (e-mail, SMS, notification), qui reçoit, données personnelles nouvelles ? service tiers payant ? |
| architecte (si impact) | ici oui (service d'envoi d'e-mails) : verdict, **coût mensuel en plus**, fiche de décision |
| designer (si nouvel écran) | maquette de l'écran de préférences de rappel |
| découpeur → GitHub | tâches dans l'étape en cours ou une nouvelle étape, après ton accord ; PR de doc (cadrage, décisions, registre RGPD) |
| toi | `/projet:avancer` sur chaque tâche, comme d'habitude |

**A2. Tu réfléchis d'abord dans le chat**

| Qui | Quoi |
| --- | --- |
| toi → chat | tu explores l'idée ; donne-lui le modèle `.github/ISSUE_TEMPLATE/tache.md` du projet |
| chat → GitHub | crée l'issue au format du modèle, avec la section « Décisions déjà prises » (si ton chat a un connecteur GitHub ; sinon tu la crées toi-même en collant son texte) |
| toi → Claude Code | `/projet:avancer <n°>` |
| Claude Code | **vérifie l'issue avant de coder** : critères manquants → il en propose et attend ton accord ; contradiction avec le code ou une décision → il la signale ; trop gros → il propose de découper ; décisions du chat → fiches de décision ; puis il réécrit l'issue au format, ton texte d'origine gardé en bas |
| Claude Code | puis cycle normal jusqu'à la PR |

Si tu hésites entre les deux : A1 dès que la fonctionnalité touche du code existant, parce que Claude Code planifie en voyant le vrai code.

### Cas B — le plugin n'est pas installé dans ce projet

| Choix | Ce qui se passe |
| --- | --- |
| **Adopter d'abord** (recommandé si tu comptes continuer à faire évoluer le projet) | `/projet:adopter evoluer` (scénario 2, étapes 2 à 4 ; les audits restent proposés) puis cas A1 |
| **Sans le plugin** (petit changement ponctuel) | Claude Code sans `/projet:*` : pas d'interview, pas de verrou de tests, pas de relecteurs séparés ni de garde-fou de merge. Demande au moins des tests avant le code et `/security-review` avant la PR |

Si le plugin n'est pas installé du tout sur ton poste, les commandes `/projet:*` n'existent pas : installe-le d'abord (README → Installation), puis ouvre une **nouvelle** session Code.

---

## Récapitulatif

| Tu veux… | Où | Commande |
| --- | --- | --- |
| réfléchir à une idée floue | chat | — |
| démarrer un projet | Claude Code | `/projet:nouveau` |
| reprendre un projet existant | Claude Code | `/projet:adopter` |
| ajouter une fonctionnalité | Claude Code (ou chat → issue) | `/projet:fonctionnalite` (ou `/projet:avancer <n°>`) |
| faire avancer le travail | Claude Code | `/projet:avancer` |
| essayer ce qui a été fait | Claude Code | `/projet:essais` |
| clore une étape | Claude Code | `/projet:etape` |
| savoir où on en est | Claude Code | `/projet:etat` |
| valider une modification | GitHub | Merge |
