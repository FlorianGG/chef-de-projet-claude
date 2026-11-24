# Mise en place d'un nouveau projet

Après l'interview (`interview.md`), dans l'ordre. Chaque étape se termine par un point avec la personne.

## 1. Prérequis

Vérifier, sans rien installer soi-même :

| Outil | Vérification | Si absent |
| --- | --- | --- |
| git | `git --version` | à installer (Windows : Git for Windows, qui fournit Git Bash, utilisé par le garde-fou) |
| GitHub CLI | `gh --version`, `gh auth status` | à installer, puis `gh auth login` par la personne |
| Node.js LTS | `node --version` | à installer : scripts du plugin et skill d'audit |
| skill `security-audit` | présent dans la liste des skills | commande d'installation dans le README du plugin ; la personne l'installe |
| skill `frontend-design` (si interface) | présent dans la liste des skills | idem ; sans lui, le designer travaille sans méthode de direction visuelle — le dire |
| skill `watch` (optionnel, sources vidéo) | présent dans la liste des skills ; Python 3.10+, ffmpeg, yt-dlp | seulement si la personne a des vidéos à exploiter ; installation dans le README du plugin |

Outils propres à la stack (SDK .NET, Python…) : vérifiés après le choix de l'architecte.

## 2. Verdict de faisabilité, stack et architecture

Lancer `projet:architecte` avec `.projet/local/interview.md` et la liste des modèles de projet du plugin (`modeles/`).

1. Présenter **d'abord le verdict** : GO / GO avec réserves / NO-GO, coût mensuel estimé (sources ou « non vérifié »), nombre d'étapes estimé, risques.
   - NO-GO : présenter ce qui le rendrait faisable ; reprendre l'interview sur ces points ou arrêter si la personne le décide.
   - GO avec réserves : chaque réserve est acceptée ou refusée par la personne ; une réserve refusée renvoie à l'architecte.
2. Puis l'architecture : ce qu'on construit, où ça tourne, comment ça se met en ligne, pourquoi ces choix. Ajuster jusqu'à l'accord de la personne.

Modèle de projet retenu : le noter dans `config.json` → `modele`.

## 3. Cadrage

Écrire `docs/cadrage.md` : objectif, utilisateurs, parcours principaux, forme, mise en ligne, données, RGPD, choix de tests, scénarios de bout en bout validés, maquettes oui/non, contraintes, hors périmètre, réserves acceptées. La personne le relit.

Si `rgpd` : créer `docs/rgpd/registre.md` depuis `modeles/rgpd-registre.md`.

## 4. Direction visuelle et maquettes (si interface et maquettes choisies)

1. Lancer `projet:designer` en mode mise en place avec le cadrage, l'architecture et le gabarit `modeles/decision.md`. Il pose la direction visuelle (méthode `frontend-design` : plan, revue contre le cadrage, contrastes vérifiés) → `docs/maquettes/jetons.css` et une fiche de décision « Direction visuelle ».
2. Présenter à la personne la direction (palette, typos, principes, ce qui a été écarté et pourquoi, tableau des contrastes) et transmettre ses questions. Ajuster jusqu'à son accord.
3. Relancer le designer pour `ecrans.md` et une maquette HTML par parcours principal. Les ouvrir pour la personne (navigateur intégré, vue téléphone puis ordinateur) ; ajuster jusqu'à son accord.

Les maquettes, les jetons et la fiche sont versionnés avec la tâche n°1. Le code reprend les variables de `jetons.css` ; une tâche ne change pas la direction visuelle sans nouvelle fiche de décision.

## 5. Découpage

Lancer `projet:decoupeur` avec le cadrage, l'architecture et l'inventaire des écrans. Il rend `.projet/local/decoupage.json`. Présenter la liste ; ajuster ; puis, **après accord**, créer milestones, labels et issues sur GitHub (`github.md`).

## 6. Tâche n°1 — Mise en place du projet

Cycle normal (`cycle-tache.md`), avec ces livrables :

- squelette **par les générateurs officiels** de la stack, jamais écrit à la main, versions figées par le fichier de verrouillage ;
- `.projet/config.json` avec les **vraies** commandes de contrôle, chacune lancée une fois ;
- `.gitignore` avec `.projet/local/` et `.env` ; `.env.example` sans valeurs réelles ; `.gitattributes` avec `* text=auto eol=lf` ;
- `.projet/ci/verrous-tests.sh` copié depuis `modeles/ci/verrous-tests.sh` du plugin ;
- CI GitHub Actions sur chaque PR : les contrôles de `config.json`, puis la vérification des verrous de tests — `actions/checkout` avec `fetch-depth: 0`, puis `bash .projet/ci/verrous-tests.sh origin/${{ github.base_ref }}` ; permissions minimales (`permissions: contents: read`) ;
- si `tests.bout_en_bout` : Playwright avec un projet mobile lancé en premier et `@axe-core/playwright`, un premier scénario sur la page d'accueil ;
- `CLAUDE.md` du projet depuis `modeles/CLAUDE.projet.md` ;
- Dependabot (`.github/dependabot.yml`) pour l'écosystème de la stack et pour `github-actions`.

## 7. Protéger la branche principale

Proposer à la personne (elle confirme) :

- dépôt public, ou compte payant : protection de la branche principale (PR obligatoire, CI verte obligatoire, pas de force-push) — voir `github.md` ;
- dépôt privé sur compte gratuit : pas disponible ; seul le garde-fou local protège la branche principale.

## 8. Mise en ligne

Si l'architecture prévoit un déploiement ou une publication : c'est une tâche du découpage, traitée par `deploiement.md` quand son tour vient.

## 9. Fin

`etat.json` → étape 1, prochaine tâche. Expliquer comment continuer : `/projet:avancer`.
