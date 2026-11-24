# Formats des fichiers

Les scripts lisent du JSON, les humains lisent du Markdown. Les agents n'échangent que des fichiers.

## Dans le dépôt du projet

```
.projet/
├─ config.json            versionné — configuration de l'orchestrateur pour ce projet
├─ pieges/                versionné — pièges connus propres au projet (acceptés)
│  └─ <id>/piege.json, diff.patch, spec.md
├─ verrous/               versionné — tache-<n>.sha256 : tests verrouillés de la tâche n
├─ ci/verrous-tests.sh    versionné — vérification des verrous en CI (copié du plugin)
└─ local/                 ignoré par git (ajouter `.projet/local/` au .gitignore)
   ├─ interview.md        réponses de l'interview
   ├─ etat.json           étape et tâche en cours
   ├─ accords.json        accords globaux donnés par la personne
   ├─ journal.jsonl       un événement par ligne
   ├─ pieges-candidats/<id>/   candidats en attente de décision
   ├─ sources/videos/<slug>/   sortie brute de watch (transcription, images)
   └─ taches/<n>/         dossier de travail de la tâche n
      ├─ tri.json
      ├─ spec.md
      ├─ controles.json
      ├─ diff.patch
      ├─ constats/<relecteur>.json
      ├─ constats-confirmes.json
      ├─ essais.md
      └─ pr.md
docs/
├─ cadrage.md, architecture.md
├─ decisions/NNNN-titre.md
├─ maquettes/             jetons.css, ecrans.md, <parcours>.html
├─ essais/etape-<k>.md    cahier d'essais consolidé d'une étape
├─ sources.md             fiches des sources (vidéos regardées : résumé, URL, horodatages)
└─ rgpd/registre.md       si rgpd = true
CLAUDE.md
```

## `.projet/config.json`

```json
{
  "plugin": { "nom": "projet", "version": "0.1.0" },
  "modele": null,
  "niveau_confiance": 2,
  "depot": "proprietaire/nom-du-depot",
  "branche_principale": "main",
  "interface": true,
  "rgpd": true,
  "tests": { "back": true, "front": true, "bout_en_bout": true },
  "maquettes": true,
  "videos": { "cloud_autorise": false },
  "deploiement": {
    "cible": "heberge",
    "workflow": "deploiement.yml",
    "url_verification": "https://exemple.fr/sante"
  },
  "controles": [
    { "nom": "format", "commande": "npm run format:check" },
    { "nom": "lint", "commande": "npm run lint" },
    { "nom": "types", "commande": "npm run typecheck" },
    { "nom": "tests", "commande": "npm test" },
    { "nom": "build", "commande": "npm run build" }
  ],
  "fichiers_tests": ["**/*.test.*", "**/*.spec.*", "e2e/**"],
  "chemins_sensibles": ["**/migrations/**", "**/auth/**", ".github/**", "package.json", "**/*.lock", ".projet/config.json"],
  "chemins_interface": ["src/**/*.tsx", "src/**/*.css"],
  "chemins_donnees_perso": ["**/users/**", "**/accounts/**"],
  "limites": { "tours_correction": 3 }
}
```

- `controles` : du moins cher au plus cher. Ce sont les vraies commandes du projet, vérifiées à la mise en place (jamais inventées).
- `modele` : `"nom@version"` si le projet est parti d'un modèle de projet du plugin.
- `deploiement.cible` : `heberge`, `release`, `registre` ou `aucun` (`deploiement.md`) ; `url_verification` seulement pour `heberge`.
- Les motifs de chemins utilisent `*` (un segment) et `**` (plusieurs segments).

## `tri.json`

```json
{
  "tache": 12,
  "nature": "code",
  "niveau_risque": "normal",
  "niveau_calcule": "normal",
  "raisons": ["touche src/pages/Inscription.tsx (interface)"],
  "relecteurs": ["code", "accessibilite", "rgpd", "securite"],
  "validation_spec": false,
  "maquette": true
}
```

`nature` : `code`, `documentation`, `configuration`, `donnees`. `niveau_risque` ≥ `niveau_calcule` (le script fixe le plancher).

## `constats/<relecteur>.json`

```json
{
  "relecteur": "accessibilite",
  "tache": 12,
  "constats": [
    {
      "id": "A1",
      "gravite": "bloquant",
      "categorie": "formulaire-libelle",
      "fichier": "src/pages/Inscription.tsx",
      "lignes": [42, 48],
      "description": "Le champ e-mail n'a pas de libellé associé.",
      "preuve": "<input type=\"email\" placeholder=\"E-mail\"> sans label ni aria-labelledby",
      "correction": "Ajouter un <label for> visible."
    }
  ]
}
```

`gravite` : `bloquant` (empêche la validation), `important` (à corriger dans la tâche si possible), `mineur` (signalé dans la PR). Aucun constat sans `fichier`, `lignes` et `preuve`.

## `constats-confirmes.json`

```json
{ "tache": 12, "tour": 1, "confirmes": ["A1"], "ecartes": [{ "id": "C3", "raison": "..." }], "remet_spec_en_cause": [] }
```

## Événement du journal (`journal.jsonl`)

```json
{"ts":"2026-11-24T10:12:00.000Z","tache":12,"evenement":"controles","details":{"ok":false,"echec":"tests","duree_ms":5120}}
```

Événements : `tri`, `spec`, `spec_validee`, `tests_ecrits`, `tests_verrouilles`, `code`, `controles`, `relecture`, `contre_verification`, `tour`, `pr_ouverte`, `pr_validee`, `question_personne`, `reponse_personne`, `probleme_tardif`, `fin_etape`, `bilan`. Pour un événement hors tâche, `<tache>` vaut `-`.

Détails lus par `mesures.mjs` (les autres événements sont libres) :

| Événement | Détails |
| --- | --- |
| `tri` | `{"niveau":"normal","relecteurs":["code","accessibilite"]}` |
| `controles` | `{"ok":false,"echec":"tests","duree_ms":5120}` |
| `relecture` | `{"relecteur":"code","bloquants":1,"importants":2,"mineurs":0}` — un événement par relecteur |
| `contre_verification` | `{"tour":1,"confirmes":{"code":1},"ecartes":{"code":1,"accessibilite":0}}` |
| `tour` | `{"tour":2}` — au début de chaque tour de correction |
| `probleme_tardif` | `{"source":"ci","categorie":"formulaire-libelle"}` — source : `ci`, `essais`, `revue-humaine` |
| `pr_ouverte` / `pr_validee` | `{"pr":34}` |

## Piège connu (`piege.json`)

```json
{
  "id": "2026-11-24-form-label",
  "statut": "candidat",
  "portee": "projet",
  "source": "contre-verificateur",
  "relecteur": "accessibilite",
  "categorie": "formulaire-libelle",
  "commit_base": "abc1234",
  "fichier": "src/pages/Inscription.tsx",
  "lignes": [42, 48],
  "description": "Champ sans libellé associé."
}
```

Accompagné de `diff.patch` (le changement fautif, appliqué sur `commit_base`) et `spec.md` (la description de la tâche). `source` : `contre-verificateur`, `essais`, `ci`, `revue-humaine`. `portee` : `projet` ou `general`.
