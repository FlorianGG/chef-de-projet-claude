# Adopter un projet existant

`/projet:adopter` installe le plugin dans un dépôt qui existe déjà, pour le faire évoluer, l'améliorer ou le sécuriser avec la même méthode qu'un projet neuf. Principe : **rien de deviné, rien de cassé**. Le projet garde sa stack, ses conventions et sa CI ; le plugin s'ajoute à côté, et tout entre par une PR que la personne merge.

## 0. Vérifier

- Dossier courant = racine d'un dépôt git avec du code ; `.projet/config.json` absent (sinon le projet est déjà adopté : proposer `/projet:etat`).
- Prérequis comme en mise en place (`mise-en-place.md` → 1).
- Arbre de travail propre ; sinon demander à la personne de commiter ou mettre de côté ses changements. Ne rien stasher à sa place.

## 1. Étude

Lancer `projet:analyste-projet` sur la racine du dépôt. Il rend `.projet/local/etude.json`, `.projet/local/architecture-existante.md`, des signalements et des questions.

Présenter à la personne : ce qu'est le projet selon l'étude, son état de santé apparent, les signalements (un secret versionné se traite **tout de suite** : la personne révoque le secret, puis on le retire de l'historique avec elle), puis les questions — seulement celles que l'étude n'a pas pu trancher.

## 2. Cadrage léger

Pas de grande interview : le projet existe. Demander seulement :

- l'objectif de l'adoption : faire évoluer, améliorer la qualité, sécuriser, rendre accessible, mettre en conformité RGPD (plusieurs possibles) ;
- les parcours principaux, tels que la personne les voit (pour les audits et les essais) ;
- ce qui ne doit pas bouger (zones fragiles, clients, contraintes) ;
- choix de tests pour la suite, si l'étude montre des manques ;
- niveau de confiance de départ : **2** si la personne travaille seule, **1** si d'autres humains ouvrent des PR sur le dépôt (l'agent relit d'abord, il produira ensuite) ;
- vidéos cloud autorisées ou non (`sources-video.md`).

Écrire `docs/cadrage.md` : ce qu'est le projet, l'objectif de l'adoption, les parcours principaux, ce qui ne doit pas bouger, hors périmètre.

## 3. Configuration (PR d'adoption)

Branche `projet/adoption`. Contenu :

- `.projet/config.json` depuis l'étude : `controles` = **les commandes de la CI existante**, dans l'ordre du moins cher au plus cher, chacune lancée une fois en local avec la personne pour vérifier qu'elle passe (une commande rouge dès le départ est notée, pas corrigée en douce : elle devient une issue) ;
- `docs/architecture.md` depuis l'architecture rétro-documentée, relue par la personne ;
- `CLAUDE.md` : s'il existe, **ne pas le remplacer** — ajouter à la fin une section « Plugin projet » (modèle : partie « Règles générales » de `modeles/CLAUDE.projet.md`) ; sinon le créer depuis le modèle ;
- `.gitignore` : ajouter `.projet/local/` (et `.env` s'il manque) ;
- `.projet/ci/verrous-tests.sh` et un workflow **séparé** `.github/workflows/projet-verrous.yml` qui le lance sur chaque PR — la CI existante n'est pas modifiée ;
- `.github/ISSUE_TEMPLATE/tache.md` (s'il existe déjà des modèles d'issue, l'ajouter à côté) ;
- labels du plugin créés sur GitHub (`github.md`), sans toucher aux labels existants ;
- `docs/rgpd/registre.md` si l'étude détecte des données personnelles (pré-rempli depuis l'étude, marqué « à compléter ») ;
- `docs/maquettes/jetons.css` : **pas** de nouvelle direction visuelle ; si le projet a des variables de design, l'inventaire écrans (`ecrans.md`) les référence.

Cycle normal pour cette PR (niveau de risque sensible : elle touche la CI), puis la personne merge.

## 4. Audits de départ

Après le merge de l'adoption, sur la branche principale :

| Audit | Quand | Outil |
| --- | --- | --- |
| Sécurité | toujours | skill `security-audit` de Cloudflare, profil `standard` (`deep` si le projet est en ligne et public) |
| Accessibilité et mobile d'abord | s'il y a une interface | `projet:relecteur-accessibilite` en mode audit sur les parcours principaux |
| RGPD | si données personnelles | `projet:relecteur-rgpd` en mode audit |
| Tests | toujours | constat de l'étude : zones critiques sans test |

Mêmes règles qu'en fin d'étape (`fin-etape.md`) : présenter les problèmes confirmés avec le passage de code et pourquoi c'est un problème.

## 5. Plan d'amélioration

Lancer `projet:decoupeur` en mode fonctionnalité avec les résultats des audits et l'objectif de l'adoption. Il propose une ou plusieurs étapes « Mise à niveau » :

- d'abord ce qui est grave et exploitable (sécurité confirmée, données personnelles exposées) ;
- puis ce qui bloque des utilisateurs (parcours principal impraticable au clavier ou sur téléphone) ;
- puis les tests manquants sur les zones critiques, **avant** de toucher à ce code ;
- le reste ensuite, par petites tâches.

Règle : on n'impose pas le mobile d'abord ni les nouvelles conventions à tout le code existant d'un coup. Les règles s'appliquent à tout code **nouveau ou modifié** ; la reprise de l'existant passe par des tâches explicites, choisies avec la personne.

Après accord : étapes et issues créées. Les issues déjà ouvertes sur le dépôt ne sont pas réécrites en masse : chacune sera complétée au moment où on la traite (`cycle-tache.md` → 0 bis).

## 6. Fin

`etat.json` à jour. Expliquer à la personne : `/projet:avancer` pour la mise à niveau, `/projet:fonctionnalite` pour une évolution, `/projet:etat` pour s'y retrouver.
