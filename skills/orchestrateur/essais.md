# Essais guidés

Les tests automatiques vérifient le code. Les essais, c'est la personne qui constate elle-même que ça fait ce qui était demandé. Ils se déroulent **dans la session principale**, en dialogue.

## Ce qui existe

- `<t>/essais.md` — essais d'une tâche, écrits par `projet:redacteur-essais` pendant les relectures, repris dans la PR.
- `docs/essais/etape-<k>.md` — cahier consolidé d'une étape, écrit en fin d'étape (mode étape), versionné.

## Dérouler (`/projet:essais`)

1. Choisir la cible : une tâche (`<n>`, avant ou après merge) ou une étape (cahier consolidé).
2. Préparer : dire comment lancer l'application (commande exacte) ou quelle URL ouvrir (prévisualisation, production), et le compte de test fictif à utiliser.
3. **Un essai à la fois** : afficher l'identifiant, les étapes, le résultat attendu, l'appareil. Attendre la réponse : ✅ OK, ❌ KO (avec ce qui s'est passé), ⏭ pas testable maintenant.
4. Tu ne réponds jamais à la place de la personne. Tu peux l'aider à reproduire (commande, chemin, capture), pas décider du résultat.
5. Un comportement non décrit par l'essai ou la spec : c'est une question, pas un KO ni un OK. La noter.
6. Résultats :
   - tâche : en commentaire sur la PR (ou sur l'issue si déjà mergée), avec l'accord de la personne ;
   - étape : colonnes « Résultat » et « Remarque » de `docs/essais/etape-<k>.md`, versionné dans la PR de fin d'étape.
7. Si la personne a un enregistrement d'écran du problème, le regarder (`sources-video.md`, moteur local — c'est souvent plein de données) et noter les horodatages utiles dans le KO.
8. Chaque KO :
   - tâche encore en PR → retour au cycle (étape 5) ;
   - sinon → issue `bug` avec étapes de reproduction, événement `probleme_tardif` (`source: essais`, `categorie` = critère ou règle concernée), candidat piège connu.
9. Résumer : nombre OK / KO / non testés, questions ouvertes.
