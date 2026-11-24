# Nouvelle fonctionnalité sur un projet existant

`/projet:fonctionnalite "idée"` : de l'idée aux issues, en partant du code réel. C'est la version courte de `interview.md` + `mise-en-place.md`, pour un projet déjà mis en place.

## 0. Lire l'existant d'abord

Avant de poser une question : `docs/cadrage.md`, `docs/architecture.md`, `docs/decisions/`, `docs/maquettes/ecrans.md`, `docs/sources.md`, `.projet/config.json`, l'état GitHub (étapes et issues ouvertes, `github.md`). Pour le code concerné, lancer un agent d'exploration en lecture seule (`subagent_type` `Explore`) avec une question précise (« où et comment sont gérés les comptes utilisateurs ? ») : tu gardes la conclusion, pas les fichiers.

Si l'idée existe déjà, en tout ou partie (issue ouverte, fonctionnalité déjà codée, hors périmètre écrit dans le cadrage) : le dire avant d'aller plus loin.

## 1. Mini-interview

Mêmes règles que `interview.md` (questions groupées, trois à quatre par message, option recommandée en premier). Seulement ce qui change :

- Reformuler l'idée en deux ou trois phrases, en la reliant à l'existant (« ça ajoute X au parcours Y »). Attendre le « oui ».
- Qui s'en sert, pour faire quoi ; parcours touchés ou nouveaux.
- Nouvel écran ? Données personnelles nouvelles ? Service tiers nouveau (coût) ? Impact sur la mise en ligne ?
- Scénarios de bout en bout si le projet en a.
- Sources : documents, vidéos (`sources-video.md`).
- Si la personne arrive avec un plan déjà fait ailleurs (chat, notes) : le lire, signaler ce qui contredit le code ou les fiches de décision, et ne reposer que les questions auxquelles il ne répond pas.

## 2. Impact technique (seulement si nécessaire)

Lancer `projet:architecte` en **mode évolution** si la fonctionnalité demande : une nouvelle dépendance, un nouveau service ou composant, un changement de modèle de données important, un nouveau service tiers, ou touche à l'authentification ou au déploiement. Il rend un verdict (GO / GO avec réserves / NO-GO), met à jour `docs/architecture.md` et écrit les fiches de décision. Présenter le verdict avant la suite.

Sinon, pas d'architecte : la fonctionnalité suit l'architecture existante.

## 3. Écrans

Nouvel écran et `config.maquettes` : lancer `projet:designer` (mode tâche) sur le ou les parcours concernés, avec la direction visuelle existante. Faire valider la maquette.

## 4. Découpage

Lancer `projet:decoupeur` en **mode fonctionnalité** avec : le résumé de la mini-interview, l'architecture, l'inventaire des écrans, la liste des issues et étapes ouvertes. Il rend `.projet/local/decoupage.json` : les tâches, et pour chacune l'étape cible (étape en cours si c'est petit et cohérent avec elle, nouvelle étape sinon).

Présenter la liste et le choix d'étape ; ajuster ; **après accord**, créer l'étape éventuelle et les issues (`github.md`).

## 5. Mettre le dépôt à jour

Dans une PR de documentation (branche `fonctionnalite/<court-titre>`), avec l'accord de la personne :

- `docs/cadrage.md` : la fonctionnalité ajoutée aux parcours, avec la date ;
- les fiches de décision nouvelles ou remplacées ;
- `docs/rgpd/registre.md` si de nouvelles données personnelles sont prévues ;
- les maquettes validées ;
- `docs/sources.md` si une source a été utilisée.

Puis proposer `/projet:avancer` sur la première tâche.
