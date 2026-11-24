# Mise en ligne

Ce que prévoit l'architecture (`docs/architecture.md` → « Mise en ligne ») est repris dans `.projet/config.json` → `deploiement` (`fichiers.md`). Rien ne coûte de l'argent ni ne sort du poste sans l'accord de la personne.

## Tâche « Mise en ligne »

Elle suit le cycle normal, niveau de risque **sensible** (CI et secrets). Livrables selon la cible :

| Cible | Livrables |
| --- | --- |
| `heberge` | workflow `.github/workflows/deploiement.yml` déclenché au push sur la branche principale (et en `workflow_dispatch`) ; environnement GitHub `production` ; prévisualisation par PR si l'hébergeur le permet ; étape finale de vérification (requête sur `deploiement.url_verification`, échec si pas de réponse 200) |
| `release` | workflow déclenché sur tag `v*` qui construit les livrables et crée une GitHub Release |
| `registre` | workflow déclenché sur tag `v*` qui publie sur le registre |
| `aucun` | rien ; README d'installation |

Règles du workflow : permissions minimales et explicites, actions tierces épinglées par version, secrets lus depuis `secrets.*` uniquement, aucun secret affiché dans les journaux.

**Secrets** : l'agent ne les manipule jamais. Il donne à la personne la liste des noms à créer et où les obtenir, puis la commande à lancer elle-même :

```
gh secret set <NOM> -R <depot> --env production
```

(ou Settings → Environments → production → Add secret). Il vérifie ensuite seulement leur **présence** avec `gh secret list -R <depot> --env production`.

Création du compte chez l'hébergeur, achat du domaine, choix d'une offre payante : faits par la personne, après rappel du coût.

## Après chaque merge (cible `heberge`)

1. Retrouver l'exécution : `gh run list -R <depot> --workflow deploiement.yml --branch <branche_principale> --limit 1 --json databaseId,status,conclusion,headSha`.
2. Attendre la fin : `gh run watch <id> -R <depot> --exit-status` (en arrière-plan si long).
3. Succès : vérifier l'URL (`curl -fsS -o /dev/null -w "%{http_code}" <url_verification>`), le dire à la personne avec l'URL.
4. Échec : récupérer la fin du journal (`gh run view <id> -R <depot> --log-failed`), l'expliquer, ouvrir une issue `bug` `risque:sensible` après accord, événement `probleme_tardif` (`source: ci`, `categorie: deploiement`). Proposer à la personne un retour arrière (revert du merge par une PR) si la production est cassée.

## Publication (cibles `release` et `registre`)

En fin d'étape, si la personne le souhaite : proposer le numéro de version (SemVer), écrire les notes de version à partir des PR de l'étape, puis donner la commande de tag. Le tag pousse une publication : c'est la personne qui le crée et le pousse (`git tag v<x.y.z> && git push origin v<x.y.z>`), l'agent suit ensuite le workflow comme ci-dessus.
