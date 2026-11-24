---
name: confiance
description: Montre ou change le niveau de confiance de l'agent sur ce projet (0 observe, 1 conseille, 2 produit).
argument-hint: "[0 | 1 | 2]"
disable-model-invocation: true
---

# /projet:confiance

Niveau demandé : $ARGUMENTS (vide = afficher le niveau actuel).

| Niveau | L'agent… |
| --- | --- |
| 0 — observe | rejoue sur des tâches déjà faites (pièges connus, relectures de PR fermées) ; n'écrit rien sur GitHub |
| 1 — conseille | relit les PR écrites par des humains et commente, avec accord |
| 2 — produit | ouvre ses propres PR ; la personne merge chacune |

Il n'existe pas de niveau où l'agent merge seul.

1. Lire `.projet/config.json` → `niveau_confiance`.
2. Sans argument : afficher le niveau, ce qu'il permet, et les mesures utiles pour décider (`node <plugin>/scripts/mesures.mjs .projet/local/journal.jsonl` : problèmes tardifs, tours de correction, constats écartés).
3. Avec un argument : expliquer ce qui change, demander confirmation, puis modifier `config.json`. Le changement est versionné dans la prochaine PR. Ce changement n'est jamais fait sur proposition d'un agent sans demande de la personne.
