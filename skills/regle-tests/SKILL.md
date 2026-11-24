---
name: regle-tests
description: "Règle du plugin projet : tests écrits avant le code, verrouillés, pyramide, scénarios de bout en bout. Préchargée dans le testeur, le codeur et les relecteurs."
user-invocable: false
---

# Tests

Les choix (tests back, tests front, scénarios de bout en bout) sont faits pendant l'interview et notés dans `.projet/config.json` → `tests`. Ce qui suit s'applique à ce qui a été choisi.

- **Tests écrits avant le code**, par un agent distinct du codeur, puis verrouillés (`.projet/verrous/tache-<n>.sha256`, versionné avec la branche et revérifié en CI). Le codeur peut contester un test, jamais le modifier ni le contourner.
- **Chaque critère d'acceptation** d'une tâche a au moins un test qui cite son identifiant (`CA-<tâche>-<n>`) dans son nom ou un commentaire.
- **Pyramide** : beaucoup de tests unitaires, des tests d'intégration sur les frontières (base de données, API), peu de tests de bout en bout, réservés aux parcours principaux.
- **Scénarios de bout en bout** : écrits en clair dans la description de la tâche (« Étant donné… quand… alors… »), puis traduits en tests. Ils se jouent en mobile d'abord, avec contrôle axe-core et un passage au clavier seul.
- **Données de test** fictives et générées.
- **Pas de test instable toléré** : un test qui échoue au hasard est mis en quarantaine avec une tâche pour le corriger, jamais supprimé en silence.
- En local et dans les boucles de correction, seuls les tests du code touché tournent ; la suite complète tourne en CI.
