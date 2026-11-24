# GitHub

Tout passe par `gh`, avec le compte de la personne. Toute création ou publication se confirme (voir règle 5 de `SKILL.md`). Corps longs : toujours via un fichier (`--body-file`), jamais en ligne de commande.

`<depot>` = `config.depot` (`proprietaire/nom`).

## Lire l'état

```
gh issue list -R <depot> --state open --json number,title,milestone,labels --limit 200
gh api repos/<depot>/milestones?state=all
gh pr list -R <depot> --state open --json number,title,headRefName,statusCheckRollup
gh pr view <pr> -R <depot> --json state,mergedAt,mergeable,statusCheckRollup
```

## Labels (créés à la mise en place)

```
gh label create "<nom>" -R <depot> --color <hex> --description "<texte>" --force
```

| Label | Usage |
| --- | --- |
| `tache` | tâche du découpage |
| `bug` | problème trouvé après coup |
| `risque:simple` / `risque:normal` / `risque:sensible` | niveau de risque après tri |
| `interface` | touche un écran |
| `donnees-perso` | touche des données personnelles |
| `bloque` | attend une réponse de la personne |
| `en-cours` | tâche en cours de traitement |

## Étapes (milestones)

```
gh api repos/<depot>/milestones -f title="Étape 1 — <nom>" -f description="<objectif en une phrase>"
```

## Tâches (issues)

Corps de l'issue (fichier temporaire, puis `gh issue create -R <depot> --title "<titre>" --body-file <f> --milestone "<titre de l'étape>" --label tache`) :

```markdown
## Ce qu'on veut
<une à trois phrases>

## Critères d'acceptation
- [ ] CA-<n>-1 : …
- [ ] CA-<n>-2 : …

## Scénarios (si bout en bout)
- Étant donné … quand … alors …

## Dépend de
#<n> (ou « rien »)
```

Le numéro `<n>` n'est connu qu'après création : créer l'issue, puis mettre à jour son corps avec les bons identifiants (`gh issue edit <n> --body-file <f>`).

## Branche et PR

```
git switch <branche_principale> && git pull --ff-only
git switch -c tache/<n>-<court-titre>
...
git push -u origin tache/<n>-<court-titre>
gh pr create -R <depot> --base <branche_principale> --head tache/<n>-<court-titre> --title "<titre lisible>" --body-file .projet/local/taches/<n>/pr.md
gh pr checks <pr> -R <depot> --watch
```

Le corps de la PR contient `Closes #<n>` pour fermer la tâche à la validation.

**Interdit** (bloqué par le hook) : `gh pr merge`, `git push` vers la branche principale, `git push --force`, suppression du dépôt.

## Protéger la branche principale

Seulement avec l'accord de la personne, et seulement si le dépôt est public ou le compte payant. Après le premier passage de la CI (pour connaître le nom des contrôles), écrire `protection.json` :

```json
{
  "required_status_checks": { "strict": true, "contexts": ["<nom du job de CI>"] },
  "enforce_admins": true,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

```
gh api -X PUT repos/<depot>/branches/<branche_principale>/protection --input protection.json
```

`enforce_admins: true` empêche aussi le propriétaire (donc l'agent, qui utilise son compte) d'envoyer directement sur la branche principale. Aucune approbation n'est exigée parce que GitHub ne permet pas d'approuver sa propre PR : la validation, c'est le clic sur Merge.

Si l'API refuse (compte gratuit, dépôt privé) : le dire, et compter sur le garde-fou local.
