# Interview de lancement

But : comprendre le projet assez pour proposer une stack, une architecture et un premier découpage, sans rien deviner. L'interview se fait **dans la session principale**, en direct avec la personne, jamais déléguée à un sous-agent.

La personne est développeuse junior (règle `projet:regle-communication`) : vocabulaire technique normal, mais chaque option vient avec sa conséquence et l'option recommandée en premier. Questions regroupées par thème, **trois à quatre par message au plus**, toujours avec « choisis pour moi » possible. On ne repose pas une question déjà répondue. Les réponses sont notées au fur et à mesure dans `.projet/local/interview.md`.

## 0. Reformuler

Reformuler l'idée en trois phrases : qui l'utilise, pour faire quoi, ce qui fait qu'elle est réussie. Demander si c'est juste. Ne passer à la suite qu'avec un « oui ».

Demander aussi s'il existe des **sources** qui aident à comprendre : documents, sites, outil existant à reproduire, **vidéos** (démo, explication du métier). Une vidéo se regarde avec `sources-video.md` ; à cette occasion, demander si l'envoi de vidéos publiques à un service cloud (Gemini) est accepté pour ce projet → `config.videos.cloud_autorise` (non par défaut).

## 1. Utilisateurs et usages

- Qui va l'utiliser ? (soi-même, une équipe, des clients, le grand public) Combien, à peu près ?
- Les trois choses les plus importantes qu'ils doivent pouvoir faire → les **parcours principaux**.
- Sur quoi : téléphone, ordinateur, les deux ? Connexion toujours disponible ?
- Besoins particuliers connus : lecteur d'écran, usage d'une main, terrain, plusieurs langues.

## 2. Forme du logiciel et suite

- Forme : application web, application mobile, logiciel de bureau, CLI, bibliothèque, script ?
- **Après le développement, on en fait quoi ?**
  - mis en ligne (hébergé, accessible depuis internet) ;
  - utilisé en local seulement (poste, réseau d'entreprise) ;
  - publié (magasin d'applications, registre npm / NuGet / PyPI…) ;
  - partagé comme code source.
- **Stockage** : quelles données, quel volume, combien de temps ? Des fichiers (images, documents) ?
- Comptes utilisateurs ? Plusieurs rôles ?
- Services tiers : paiement, e-mails, carte, calendrier, API existante ?

## 3. Données personnelles (déclenche le RGPD)

- Le logiciel garde-t-il des informations sur des personnes (nom, e-mail, téléphone, adresse, localisation, photos, santé, paiements) ?
- Si oui : pourquoi chacune est nécessaire ; combien de temps la garder ; qui y a accès.
- Si oui → `rgpd: true`, relecteur RGPD activé, registre créé à la mise en place. Rappeler que ce n'est pas un avis juridique.

## 4. Technique

- **Des technos de préférence ?** (langage, framework, base de données, hébergeur, ou « ce que je connais déjà »). Si non → l'architecte choisit et justifie.
- Ce que la personne maîtrise déjà et ce qu'elle veut apprendre : l'architecte en tient compte.
- Contraintes : budget mensuel maximum, hébergement en France / UE, outils imposés.
- Qui maintiendra le projet ensuite ?

## 5. Qualité et tests

L'accessibilité et le mobile d'abord ne sont **pas** des questions : ce sont des règles. Les annoncer.

- **Tests back** (unitaires, intégration) : oui (recommandé dès qu'il y a des données ou des calculs) / non.
- **Tests front** (composants) : oui / non.
- **Tests de bout en bout** (Playwright, mobile d'abord, avec axe-core) : oui (recommandé pour les parcours principaux) / non.
- Si oui : proposer les scénarios tirés des parcours principaux, en « Étant donné… quand… alors… », et les faire valider.
- **Maquettes avant le code** pour les nouveaux écrans : oui (par défaut s'il y a une interface) / non.

## 6. GitHub et suivi

- Le dépôt existe-t-il ? Sinon : la personne le crée, ou l'agent propose `gh repo create` et attend son accord. Public ou privé ?
- Dépôt privé sur compte gratuit : la protection de branche GitHub n'y est pas disponible, seul le garde-fou local protège la branche principale. Le dire.
- Rythme : une tâche à la fois (par défaut) ou plusieurs tâches indépendantes en parallèle.

## 7. Clore

- Résumer en une page : objectif, utilisateurs, parcours principaux, forme, mise en ligne, données, RGPD, tests, maquettes, contraintes.
- Point encore flou qui change le choix de la stack : le poser. Sinon : passer à l'architecte, dont le **verdict de faisabilité** (GO / GO avec réserves / NO-GO) est présenté à la personne avant toute suite (`mise-en-place.md`).
