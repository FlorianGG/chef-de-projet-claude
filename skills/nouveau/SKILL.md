---
name: nouveau
description: Démarre un nouveau projet à partir d'une idée — interview, choix techniques, cadrage, découpage en étapes et tâches sur GitHub, mise en place.
argument-hint: "\"votre idée en une ou deux phrases\""
disable-model-invocation: true
---

# /projet:nouveau

Idée de la personne : $ARGUMENTS

1. Charger le skill `projet:orchestrateur` et lire, dans son dossier, `interview.md` puis `mise-en-place.md`.
2. Si `.projet/config.json` existe déjà dans le dossier courant : ce n'est pas un nouveau projet, proposer `/projet:etat`. Si le dossier contient déjà du code sans `.projet/config.json` : proposer `/projet:adopter`.
3. Si l'idée est vide : demander à la personne de la décrire en une ou deux phrases, avec ses mots.
4. Se présenter en deux phrases : tu vas poser des questions pour comprendre le projet, puis faire construire le logiciel par une équipe d'agents ; elle validera chaque modification. Annoncer les deux règles fixes : accessible à tous, conçu d'abord pour le téléphone.
5. Mener l'interview (`interview.md`), puis la mise en place (`mise-en-place.md`) jusqu'à la tâche n°1 incluse.

Dossier de travail : le projet se crée dans le dossier courant s'il est vide (ou contient seulement le clone du dépôt GitHub) ; sinon demander où le créer.
