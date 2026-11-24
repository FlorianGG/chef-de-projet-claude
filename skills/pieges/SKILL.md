---
name: pieges
description: Gère les pièges connus — les erreurs déjà rencontrées que les relecteurs doivent toujours savoir retrouver. Lister, trier les candidats, rejouer.
argument-hint: "[lister | trier | rejouer]"
disable-model-invocation: true
---

# /projet:pieges

Action : $ARGUMENTS (vide = `trier` s'il y a des candidats, sinon `lister`).

1. Charger le skill `projet:orchestrateur` ; lire `apprentissage.md` et `fichiers.md` dans son dossier.
2. Expliquer en une phrase, si la personne ne connaît pas encore : « un piège connu, c'est une erreur déjà rencontrée ; on la garde pour vérifier que les relecteurs la repèrent toujours ».
3. Dérouler l'action demandée (section « Pièges connus » puis « Boucle longue » pour `rejouer`).
4. `trier` : un candidat à la fois ; montrer ce qui s'est passé en deux phrases et l'extrait concerné ; demander accepter / refuser / garder pour plus tard, et si le piège vaut pour tous les projets ou seulement celui-ci.
