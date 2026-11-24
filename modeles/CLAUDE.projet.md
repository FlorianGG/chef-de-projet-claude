# <Nom du projet>

<Une phrase : ce que fait le logiciel, pour qui.>

Projet piloté par le plugin Claude Code « projet » (version dans `.projet/config.json`). Pour avancer : `/projet:avancer` ; état : `/projet:etat`.

## Règles générales (détail dans le plugin, `skills/regle-*/`)

- Accessibilité d'abord : WCAG 2.2 AA, axe-core sans violation grave, parcours principaux au clavier.
- Mobile d'abord : styles de base pour le téléphone, `min-width` pour élargir, tests de bout en bout mobile en premier.
- Tests écrits avant le code et verrouillés ; un critère d'acceptation = au moins un test qui cite `CA-<tâche>-<n>`.
- Aucun secret dans le dépôt ; entrées validées côté serveur ; droits vérifiés côté serveur.
- Personne ne valide son propre travail ; l'agent ne merge jamais une PR.

## Stack

<Repris de docs/architecture.md : langages, frameworks, versions, base de données, hébergement.>

## Commandes

| Action | Commande |
| --- | --- |
| Installer | <commande vérifiée> |
| Lancer en local | <commande vérifiée> |
| Contrôles (dans l'ordre) | voir `.projet/config.json` → `controles` |
| Tests de bout en bout | <commande vérifiée> |

## Organisation du code

<Dossiers principaux et leur rôle.>

## Règles propres au projet

<Ajoutées au fil des tâches et des bilans. Chaque règle renvoie à sa fiche de décision : `docs/decisions/NNNN`.>
