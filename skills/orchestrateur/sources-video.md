# Sources vidéo

Une vidéo peut aider à comprendre un sujet ou servir de source : démo d'un outil existant, explication du métier, conférence ou tutoriel officiel sur une techno, enregistrement d'écran d'un bug. On s'appuie sur le skill `watch` du plugin [claude-video](https://github.com/bradautomates/claude-video) (MIT, dépendance optionnelle, installée par la personne).

## Qui la regarde

**Toi, dans la session principale**, jamais un sous-agent : le premier lancement de `watch` pose des questions de configuration, et c'est toi qui contrôles ce qui sort du poste. Les sous-agents lisent seulement les résumés produits ici ; s'il leur faut une vidéo, ils le demandent dans leur réponse et tu la regardes pour eux.

Skill absent (`watch:watch` introuvable) : le dire, donner la commande d'installation (README du plugin) et continuer sans la vidéo.

## Ce qui sort du poste

`watch` a deux moteurs :

- **local** (par défaut dans ce plugin) — images et transcription extraites sur la machine ; seule l'URL est contactée pour le téléchargement.
- **gemini** — la vidéo est envoyée à Google, qui la regarde. À n'utiliser que si `config.videos.cloud_autorise` est vrai **et** que la vidéo est publique **et** que la personne l'accepte pour cette vidéo-là.

Jamais de moteur cloud (gemini, ni transcription groq / openai) pour une vidéo qui contient des données personnelles : enregistrement d'écran avec de vraies données, réunion, personnes identifiables. En cas de doute, demander. Le premier lancement de `watch` (questions de configuration) se fait avec la personne ; recommander `local`.

Clés d'API : la personne les ajoute elle-même dans la configuration de `watch` ; tu ne les lis pas, ne les affiches pas, ne les passes jamais en ligne de commande.

## Regarder

1. Formuler une question précise (« quelles étapes suit l'utilisateur pour créer une facture ? », pas « résume la vidéo »).
2. Niveau de détail le plus léger qui suffit : `transcript` si seul le discours compte, `balanced` si l'écran compte.
3. Lancer `watch` (outil Skill, `watch:watch`) avec la source et la question.
4. Une transcription seule ne prouve aucun fait visuel ; un fait visuel se cite avec l'horodatage de l'image.

## Garder la trace

| Quoi | Où | Versionné |
| --- | --- | --- |
| Sortie brute (transcription, images, rapport) | `.projet/local/sources/videos/<slug>/` | non |
| Fiche de la source | `docs/sources.md` | oui |

Une entrée de `docs/sources.md` :

```markdown
## <slug> — <titre de la vidéo>

- Source : <URL ou « fichier local fourni par la personne, non versionné »>
- Auteur, date : <si connus>
- Regardée le : AAAA-MM-JJ, moteur local | gemini, détail <niveau>
- Utilisée pour : <interview | architecture | tâche #n | essai ESS-n-k>
- Question posée : <…>

### Ce qu'on en retient
- <fait> — [mm:ss]
- <fait> — [mm:ss]

### Limites
<ce que la vidéo ne permet pas d'établir ; ce qui reste à confirmer>
```

## Droits et fiabilité

- **Droits d'auteur** : ne pas versionner de transcription complète ni de captures d'une vidéo dont on n'a pas les droits ; dans le dépôt, seulement un résumé dans nos mots, l'URL et des citations courtes horodatées. Ne pas reverser le contenu d'une vidéo dans le code ou la documentation du projet.
- **Plateformes** : télécharger une vidéo peut être contraire aux conditions d'utilisation de certaines plateformes ; le signaler à la personne la première fois, elle décide.
- **Une vidéo est une source, pas une vérité** : une info technique tirée d'une vidéo (version, API, commande) est revérifiée dans la documentation officielle avant d'être utilisée ; sinon elle est marquée « non vérifié ».

## Quand la proposer

- **Interview** : la personne a une démo, un outil existant à reproduire, une vidéo qui explique le métier.
- **Architecture** : une conférence ou un tutoriel officiel aide à trancher entre deux options (la documentation officielle reste prioritaire).
- **Description d'une tâche** : une vidéo de démonstration du comportement attendu.
- **Bug ou essai en échec** : un enregistrement d'écran du problème, résumé dans l'issue avec les horodatages (sans données personnelles visibles si l'issue est publique).
