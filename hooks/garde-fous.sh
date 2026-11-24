#!/usr/bin/env bash
# Garde-fou du plugin « projet » (PreToolUse sur Bash et PowerShell).
# Dans un dépôt piloté par le plugin (présence de .projet/config.json), bloque :
#   - la fusion d'une PR (gh pr merge, API .../pulls/N/merge) : c'est la personne qui valide ;
#   - tout envoi sur la branche principale et tout force-push ;
#   - la suppression du dépôt et de la protection de branche.
# Bloquer = code de sortie 2, raison sur stderr (renvoyée à Claude).
# Volontairement sans Node ni jq : il doit marcher même si le reste n'est pas installé.

entree="$(cat)"

# Dossier de travail de l'appel (champ "cwd" de l'entrée JSON), sinon dossier courant.
cwd="$(printf '%s' "$entree" | grep -o '"cwd"[[:space:]]*:[[:space:]]*"[^"]*"' | head -n 1 | sed 's/.*:[[:space:]]*"\(.*\)"/\1/' | sed 's/\\\\/\//g')"
[ -n "$cwd" ] && [ -d "$cwd" ] && cd "$cwd" 2>/dev/null

racine="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
config="$racine/.projet/config.json"
[ -f "$config" ] || exit 0

principale="$(grep -o '"branche_principale"[[:space:]]*:[[:space:]]*"[^"]*"' "$config" | head -n 1 | sed 's/.*:[[:space:]]*"\(.*\)"/\1/')"
[ -n "$principale" ] || principale="main"

# Commande demandée (texte brut de l'entrée : suffisant pour reconnaître les motifs).
commande="$entree"

bloquer() {
  echo "Bloqué par le garde-fou du plugin « projet » : $1" >&2
  echo "L'agent ne fusionne jamais et ne modifie jamais la branche principale directement. La personne valide en cliquant sur Merge." >&2
  exit 2
}

if printf '%s' "$commande" | grep -Eq 'gh[[:space:]]+pr[[:space:]]+merge'; then
  bloquer "fusion d'une proposition de modification (gh pr merge)."
fi
if printf '%s' "$commande" | grep -Eq 'pulls/[0-9]+/merge'; then
  bloquer "fusion d'une proposition de modification par l'API."
fi
if printf '%s' "$commande" | grep -Eq 'gh[[:space:]]+repo[[:space:]]+delete'; then
  bloquer "suppression du dépôt."
fi
if printf '%s' "$commande" | grep -Eq 'branches/[^ "]+/protection' && printf '%s' "$commande" | grep -Eq '(-X|--method)[[:space:]]*DELETE'; then
  bloquer "suppression de la protection de branche."
fi

if printf '%s' "$commande" | grep -Eq 'git[[:space:]]+push'; then
  if printf '%s' "$commande" | grep -Eq 'git[[:space:]]+push[^|;&]*([[:space:]]-f([[:space:]]|$|")|--force|[[:space:]]\+[^[:space:]]+)'; then
    bloquer "envoi forcé (force-push)."
  fi
  if printf '%s' "$commande" | grep -Eq "git[[:space:]]+push[^|;&]*[[:space:]:]$principale([[:space:]]|\$|\"|;|&|\\|)"; then
    bloquer "envoi direct sur la branche principale ($principale)."
  fi
  actuelle="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
  if [ "$actuelle" = "$principale" ]; then
    bloquer "envoi depuis la branche principale ($principale) : travailler sur une branche de tâche."
  fi
fi

exit 0
