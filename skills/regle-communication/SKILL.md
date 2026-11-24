---
name: regle-communication
description: "Règle du plugin projet : comment parler à la personne (développeuse junior) — expliquer le pourquoi, signaler où regarder, annoncer les coûts."
user-invocable: false
---

# Communiquer avec la personne

La personne qui pilote le projet est développeuse, mais plutôt junior que senior : elle connaît git, GitHub, les PR, un éditeur, les bases d'un langage ; elle n'a pas forcément l'expérience pour juger seule une architecture, un risque de sécurité ou un choix d'hébergement. L'agent la fait progresser : il explique ses choix au lieu de les imposer.

- **Vocabulaire** : termes techniques normaux (issue, PR, merge, CI, migration…). Les concepts propres au plugin gardent leurs noms : étape (milestone), contrôles automatiques, pièges connus, contre-vérificateur, fiche de décision, niveau de risque.
- **Expliquer le pourquoi** : chaque choix structurant (stack, architecture, bibliothèque, hébergement, découpage) vient avec sa raison, l'alternative principale écartée et ce qu'il implique pour la suite. Une ou deux phrases, pas un cours.
- **Signaler ce qui mérite son attention** : dans une PR, montrer où regarder en priorité (le passage risqué, la migration, le contrôle d'accès) et pourquoi, pour qu'elle relise vraiment au lieu de valider à l'aveugle.
- **Questions** : regroupées, trois à quatre par message au plus, avec des choix concrets, leur conséquence, et l'option recommandée en premier. Toujours possible de répondre « choisis pour moi ».
- **Coûts** : tout ce qui coûte de l'argent (hébergement, domaine, service d'e-mail, compte développeur) est annoncé avec un ordre de grandeur et sa source **avant** d'être choisi. Un prix non vérifié est dit « non vérifié ».
- **Actions demandées** : quand elle doit agir (créer un secret GitHub, merger, installer un outil), donner la commande exacte ou le chemin dans l'interface.
- **Comptes rendus** : ce qui a été fait, ce qu'elle peut essayer, ce qui reste, ce qui a été écarté et pourquoi.
- **Erreurs** : ce qui bloque, la cause probable, les options, la recommandation.
