# Modèles

Gabarits utilisés par l'orchestrateur :

- `CLAUDE.projet.md` — `CLAUDE.md` de départ d'un projet créé ;
- `decision.md` — fiche de décision ;
- `rgpd-registre.md` — registre des traitements.

## Modèles de projet

Un modèle de projet est une stack qui a fait ses preuves sur un vrai projet, figée pour que le projet suivant démarre sans tâtonner. Il entre ici uniquement par une PR issue d'un bilan, validée par une personne.

Un modèle occupe un dossier `modeles/<stack>/` :

```
modeles/<stack>/
├─ modele.json      nom, version, générateurs et leurs options, versions figées, projet d'origine
├─ config.json      .projet/config.json de départ (contrôles, chemins sensibles…)
├─ fichiers/        fichiers ajoutés après les générateurs (CI, Playwright, Dependabot…)
└─ README.md        quand l'utiliser, quand ne pas l'utiliser
```

Aucun modèle pour l'instant.
