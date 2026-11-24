# projet — un chef de projet IA pour Claude Code

Plugin Claude Code qui transforme une idée en logiciel, piloté sur GitHub. Il pose les questions qu'il faut, rend un verdict de faisabilité, choisit la stack si vous n'avez pas de préférence, découpe le travail en étapes et en issues, puis fait maquetter, tester, coder et relire chaque tâche par des sous-agents spécialisés. Chaque tâche arrive en PR, avec ce qui change, où regarder en priorité et ce qui a été vérifié. **C'est vous qui mergez**, jamais l'agent.

Pensé pour une développeuse ou un développeur junior : l'agent explique ses choix au lieu de les imposer.

Deux règles ne se négocient pas : **accessibilité** (WCAG 2.2 AA) et **mobile d'abord**.

## Prérequis

| Outil | Pourquoi |
| --- | --- |
| [Claude Code](https://code.claude.com) | fait tourner l'agent |
| [Git](https://git-scm.com) | sous Windows, Git for Windows fournit aussi Git Bash, utilisé par le garde-fou |
| [GitHub CLI](https://cli.github.com) | issues, milestones, PR, CI (`gh auth login`) |
| [Node.js LTS](https://nodejs.org) | scripts de contrôle du plugin, audit de sécurité |

`/projet:nouveau` vérifie tout ça avant de commencer.

### Audit de sécurité de fin d'étape (recommandé)

Le plugin s'appuie sur le skill d'audit de [Cloudflare](https://github.com/cloudflare/security-audit-skill) (MIT) :

```
npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit --global
```

Sans lui, l'audit de fin d'étape est signalé « non fait ». La relecture sécurité de chaque PR (`/security-review`, intégrée à Claude Code) tourne dans tous les cas.

### Direction visuelle (recommandé pour les projets avec interface)

Le designer et le codeur s'appuient sur le skill [`frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design) d'Anthropic (Apache-2.0) pour donner au projet une identité visuelle propre plutôt qu'un rendu générique :

```
npx skills add anthropics/skills@frontend-design --global
```

Les règles d'accessibilité et de mobile d'abord du plugin passent toujours devant ses choix esthétiques. Sans lui, les maquettes restent faites, sans cette méthode.

### Sources vidéo (optionnel)

Pour exploiter une vidéo (démo d'un outil existant, explication du métier, tutoriel, enregistrement d'écran d'un bug), le plugin s'appuie sur [claude-video](https://github.com/bradautomates/claude-video) (MIT), qui a besoin de Python 3.10+, ffmpeg et yt-dlp :

```
/plugin marketplace add bradautomates/claude-video
/plugin install watch@claude-video
```

Le moteur local (rien n'est envoyé à un tiers) est utilisé par défaut. Le moteur Gemini, qui envoie la vidéo à Google, n'est utilisé que pour des vidéos publiques et avec votre accord, jamais pour une vidéo contenant des données personnelles. Seuls un résumé, l'URL et les horodatages cités sont versionnés (`docs/sources.md`).

## Installation

```
/plugin marketplace add <proprietaire>/<depot>
/plugin install projet@projet-local
```

Depuis un clone local : `/plugin marketplace add ./chemin/du/clone`. Pour l'essayer sans l'installer : `claude --plugin-dir ./chemin/du/clone`.

## Commandes

| Commande | Ce qu'elle fait |
| --- | --- |
| `/projet:nouveau "mon idée"` | interview, verdict de faisabilité, stack et architecture, maquettes, étapes et issues, mise en place |
| `/projet:avancer [n°]` | fait avancer une tâche jusqu'à une PR prête à relire |
| `/projet:essais [n° \| etape k]` | déroule les essais manuels avec vous, transforme les échecs en bugs |
| `/projet:etat` | où en est le projet, ce qui vous attend |
| `/projet:etape` | clôt une étape : essais, audits sécurité / RGPD / accessibilité, publication, bilan |
| `/projet:bilan` | ce qui a coincé, et un changement proposé (au projet ou au plugin) |
| `/projet:pieges` | gère les pièges connus : erreurs déjà rencontrées que les relecteurs doivent toujours retrouver |
| `/projet:confiance [0-2]` | voir ou changer ce que l'agent a le droit de faire |

## Ce qui se passe pour chaque tâche

description de ce qu'on va faire → maquette si nouvel écran → tests écrits avant le code et verrouillés → code → contrôles automatiques → relectures indépendantes (code, accessibilité, sécurité, RGPD si besoin) → contre-vérification des constats → essais → PR → **votre merge** → suivi du déploiement si le projet est en ligne.

Le verrou des tests est revérifié par la CI : un test modifié après coup pour faire passer le code fait échouer la PR.

Détails : [CONCEPTION.md](CONCEPTION.md).

## Garde-fous

- Un hook bloque, dans les projets pilotés par le plugin : `gh pr merge`, le merge par l'API, tout push sur la branche principale, tout force-push, la suppression du dépôt ou de la protection de branche.
- L'agent ne manipule jamais un secret : il vous donne la commande pour le créer.
- Tout ce qui coûte de l'argent ou sort de votre poste vous est demandé avant.
- L'audit RGPD signale des écarts aux bonnes pratiques ; ce n'est pas un avis juridique.

## Arborescence

```
.claude-plugin/   manifeste et marketplace
skills/           commandes /projet:*, méthode de l'orchestrateur (orchestrateur/), règles générales (regle-*/)
agents/           sous-agents
scripts/          contrôles déterministes (Node, sans dépendance)
hooks/            garde-fou
modeles/          gabarits, script CI des verrous, modèles de projet
pieges/           pièges connus généraux
```

## Licence

MIT — voir [LICENSE](LICENSE).
