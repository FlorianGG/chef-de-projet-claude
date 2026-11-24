# Conception — plugin « projet »

Un chef de projet IA qui part d'une idée, pose les bonnes questions, rend un verdict de faisabilité, puis fait concevoir, maquetter, tester, coder et relire le logiciel par des sous-agents, sur GitHub. La personne qui le pilote est développeuse, plutôt junior : l'agent explique ses choix, lui montre où regarder dans chaque PR, et c'est elle qui merge.

## Principes

1. **Accessibilité d'abord, mobile d'abord.** Toute interface vise WCAG 2.2 AA et se conçoit pour un téléphone avant l'ordinateur. Un relecteur accessibilité tourne sur chaque tâche qui touche un écran.
2. **Personne ne valide son propre travail.** Celui qui code ne relit pas son code ; les relecteurs sont séparés et en lecture seule ; un contre-vérificateur confirme les constats avant correction.
3. **Ce qui peut être une règle est un script.** Contrôles automatiques, verrou des tests (vérifié aussi en CI), niveau de risque, garde-fous : aucune IA ne peut les assouplir.
4. **La personne merge, l'agent jamais.** Un hook bloque tout merge, tout push sur la branche principale et tout force-push.
5. **Vérifier du moins cher au plus cher**, arrêt au premier échec : rien ne part en relecture tant que les contrôles automatiques sont rouges.
6. **Rien de deviné.** Ce que l'agent ne sait pas devient une question ; aucun prix, aucune version, aucune commande inventés.
7. **Expliquer plutôt qu'imposer.** Chaque choix structurant vient avec sa raison et l'alternative écartée.
8. **Les agents échangent des fichiers**, et chacun ne reçoit que ce dont il a besoin.

## Ce qui appartient à quoi

La séparation est stricte : le plugin ne contient rien de propre à un projet, un projet ne modifie jamais le plugin.

### Le plugin — commun à tous les projets

| Élément | Emplacement |
| --- | --- |
| Commandes `/projet:*` (une par skill) | `skills/<commande>/SKILL.md` |
| Méthode de l'orchestrateur | `skills/orchestrateur/` |
| Règles générales, préchargées dans les agents | `skills/regle-*/` |
| Sous-agents | `agents/` |
| Scripts déterministes | `scripts/` |
| Garde-fous | `hooks/` |
| Gabarits et modèles de projet | `modeles/` |
| Pièges connus généraux | `pieges/` |
| Version du plugin | `.claude-plugin/plugin.json` |

### Le projet créé — propre à ce projet

| Élément | Emplacement | Versionné |
| --- | --- | --- |
| Code, tests, CI, déploiement | selon la stack, `.github/workflows/` | oui |
| Cadrage, architecture | `docs/cadrage.md`, `docs/architecture.md` | oui |
| Fiches de décision | `docs/decisions/NNNN-titre.md` | oui |
| Maquettes | `docs/maquettes/` | oui |
| Cahiers d'essais | `docs/essais/etape-<k>.md` | oui |
| Fiches des sources (vidéos regardées) | `docs/sources.md` | oui |
| Règles du projet | `CLAUDE.md` | oui |
| Configuration de l'orchestrateur | `.projet/config.json` | oui |
| Verrous des tests | `.projet/verrous/tache-<n>.sha256` | oui |
| Pièges connus du projet | `.projet/pieges/` | oui |
| Registre RGPD (si données personnelles) | `docs/rgpd/registre.md` | oui |
| Journal, mesures, fichiers de travail des tâches | `.projet/local/` | **non** |

`.projet/config.json` note la version du plugin et du modèle de projet d'origine. Le `CLAUDE.md` du projet rappelle les règles générales en cinq lignes ; les agents du plugin appliquent la version complète.

## Déroulé

```
/projet:nouveau "idée"
   ├─ 0. Prérequis : git, gh connecté, Node
   ├─ 1. Interview (session principale, avec la personne)
   ├─ 2. Verdict de faisabilité : GO / GO avec réserves / NO-GO, coût, nombre d'étapes (architecte)
   ├─ 3. Stack, architecture, plan de mise en ligne, fiches de décision → validés
   ├─ 4. Cadrage écrit
   ├─ 5. Direction visuelle (designer + skill frontend-design) puis maquettes des parcours principaux → validées
   ├─ 6. Étapes et tâches (decoupeur) → validées → créées sur GitHub
   └─ 7. Tâche n°1 « Mise en place » : générateurs officiels, CI avec vérification des verrous, CLAUDE.md
/projet:fonctionnalite   nouvelle fonctionnalité sur un projet existant : lit le code, mini-interview,
                         architecte si impact, maquette si nouvel écran, issues dans l'étape en cours ou une nouvelle
/projet:avancer [n°]     une tâche → une PR à relire et merger (une issue créée ailleurs est d'abord complétée)
/projet:essais [n°]      dérouler les essais avec la personne
/projet:etape            essais de l'étape, audits sécurité / RGPD / accessibilité, publication, bilan
/projet:bilan · /projet:pieges · /projet:etat · /projet:confiance
```

### Planifier ailleurs

La personne peut réfléchir dans un chat. Règle : **le chat réfléchit, le dépôt décide, Claude Code exécute** — une seule source de vérité, le dépôt. Le modèle d'issue du projet (`.github/ISSUE_TEMPLATE/tache.md`) sert de consigne au chat ; une issue incomplète ou contradictoire est complétée avec la personne avant tout code, et les décisions qu'elle contient deviennent des fiches de décision.

### Cycle d'une tâche

| # | Étape | Qui | Sortie |
| --- | --- | --- | --- |
| 1 | Tri : niveau de risque, relecteurs | orchestrateur + script `niveau-risque` | `tri.json` |
| 2 | Description de ce qu'on va faire | redacteur-spec | `spec.md` |
| 3 | Maquette (nouvel écran) | designer, validée par la personne | `docs/maquettes/` |
| 4 | Tests avant le code, verrouillés et commités | testeur + script `verrou-tests` | tests + `.projet/verrous/tache-<n>.sha256` |
| 5 | Code | codeur (contexte neuf) | diff |
| 6 | Contrôles automatiques | script `controles` | `controles.json` |
| 7 | Relectures en parallèle + essais | relecteurs, `/security-review`, redacteur-essais | `constats/*.json`, `essais.md` |
| 8 | Contre-vérification (s'il y a des constats bloquants ou importants) | contre-verificateur | `constats-confirmes.json` → retour en 5 |
| 9 | PR | redacteur-pr | PR : ce qui change, où regarder, ce qui a été vérifié |
| 10 | Essais et merge | la personne | merge ; puis suivi du déploiement |

Boucles : au plus 3 tours ; un bloquant présent deux tours remonte à la personne. Un constat qui remet la description en cause renvoie à l'étape 2. La CI revérifie le verrou des tests : un test modifié après coup fait échouer la PR.

### Niveaux de risque

| Niveau | Quand | Effet |
| --- | --- | --- |
| simple | changement local, sans écran ni donnée | relecteur-code seul, description validée seulement s'il y a des questions |
| normal | tout le reste | relecteurs par défaut + ceux activés par le tri |
| sensible | migration, authentification, droits, données personnelles, CI, déploiement, dépendances | description validée, tous les relecteurs concernés, vraie relecture du code avant merge |

Le plancher est calculé par script à partir des fichiers touchés ; l'orchestrateur peut monter le niveau, jamais le descendre.

## Mise en ligne

L'architecte décrit la cible (hébergé, release, registre, aucun) et son coût. Une tâche « Mise en ligne » crée le workflow de déploiement ou de publication. Les secrets sont créés par la personne (l'agent donne la commande, vérifie seulement leur présence). Après chaque merge d'un projet hébergé, l'orchestrateur suit le déploiement et vérifie l'URL ; un échec devient un bug, avec proposition de revert si la production est cassée. Les publications partent d'un tag que la personne pousse.

## Sécurité

- **Chaque PR** : `/security-review`.
- **Chaque fin d'étape** : audit complet avec le skill `security-audit` de Cloudflare (https://github.com/cloudflare/security-audit-skill), à installer par la personne. Sans bac à sable isolé, il n'exécute pas le code du projet et marque ces points « à valider ».

## Design

Le designer pose une direction visuelle propre au sujet et au public du projet, avec la méthode du skill `frontend-design` d'Anthropic (https://github.com/anthropics/skills/tree/main/skills/frontend-design), à installer par la personne : plan (palette, typographies, mise en page, principes), revue contre le brief pour écarter les rendus génériques, puis jetons CSS et fiche de décision validés par la personne. Le codeur suit ces jetons et les consignes du skill sur les textes d'interface. **Ordre de priorité** : cadrage et spec, puis accessibilité et mobile d'abord, puis `frontend-design`.

## Sources vidéo

Une vidéo peut aider à comprendre le sujet ou servir de source (démo, métier, tutoriel, bug filmé). L'orchestrateur la regarde lui-même, dans la session principale, avec le skill `watch` de claude-video (https://github.com/bradautomates/claude-video), dépendance optionnelle. Moteur local par défaut ; moteur cloud seulement pour une vidéo publique, si le projet l'autorise et avec l'accord de la personne, jamais avec des données personnelles. Sortie brute en local ; dans le dépôt, une fiche par vidéo dans `docs/sources.md` (résumé, URL, horodatages, limites). Les agents lisent ces fiches et demandent une vidéo au lieu de la regarder. Une info technique tirée d'une vidéo est revérifiée dans la documentation officielle.

## RGPD

Activé quand l'interview révèle des données personnelles : registre dès la conception, relecteur RGPD sur les tâches concernées, audit en fin d'étape. Ce n'est pas un avis juridique.

## Apprendre de chaque projet

**Boucle courte — dès le départ.** Journal de chaque tâche (tours, constats écartés, problèmes trouvés tard, questions posées) ; fiches de décision relues par les agents ; candidats pièges connus créés à chaque bloquant confirmé, échec de CI imprévu ou essai en échec, triés par la personne (`/projet:pieges`).

**Le bilan — à chaque fin d'étape.** Un seul changement proposé, preuves à l'appui, adressé au projet (PR dans le projet) ou au plugin (PR sur le dépôt du plugin). La personne décide. Aucun assouplissement de règle sans justification écrite.

**Boucle longue — à partir d'une vingtaine de pièges acceptés.** Rejeu des pièges : chaque relecteur doit toujours les retrouver (détection par script, trois essais, pas de juge IA). Une nouvelle version d'un relecteur qui rate un piège déjà connu n'est pas adoptée.

**Modèles de projet.** Une stack qui a fait ses preuves est figée en modèle dans le plugin ; le projet suivant sur la même stack en part.

## Niveaux de confiance

| Niveau | L'agent… |
| --- | --- |
| 0 — observe | rejoue sur des tâches déjà faites, n'écrit rien |
| 1 — conseille | relit les PR écrites par des humains |
| 2 — produit | ouvre ses PR ; la personne merge chacune |

Il n'y a pas de niveau où l'agent merge seul.

## Glossaire

| Terme du plugin | Signification |
| --- | --- |
| étape | milestone GitHub |
| tâche | issue GitHub |
| description de ce qu'on va faire | spécification de la tâche (`spec.md`) |
| contrôles automatiques | format, lint, types, tests, build, dans l'ordre de `config.controles` |
| verrou des tests | empreintes des tests écrits avant le code, versionnées et revérifiées en CI |
| niveau de risque | simple / normal / sensible |
| contre-vérificateur | agent qui cherche à réfuter les constats des relecteurs |
| essais | vérifications manuelles faites par la personne |
| pièges connus | erreurs déjà rencontrées que les relecteurs doivent toujours retrouver |
| fiche de décision | ADR |
| modèle de projet | stack éprouvée, figée pour démarrer un nouveau projet |

## Points à vérifier en conditions réelles

- Nom des skills préchargés dans `skills:` des agents (`projet:regle-…` ou `regle-…`, et `frontend-design` installé hors du plugin) : non documenté. Les agents peuvent aussi charger ces skills avec l'outil Skill.
- Valeur de `subagent_type` pour un agent de plugin (`projet:<nom>`) : non documentée.
- Déclenchement du hook garde-fou dans une vraie session (testé seulement à la main).

## Hors périmètre (v1)

- Merge automatique, à aucun niveau.
- Exécution sur GitHub Actions (l'orchestration tourne dans une session Claude Code locale).
- Publication sur les magasins d'applications (étapes manuelles décrites seulement).
- Prise en main d'un projet existant (le plugin démarre des projets neufs).
