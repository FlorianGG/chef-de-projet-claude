#!/usr/bin/env bash
# Vérifie en CI que les tests verrouillés par les tâches de la PR n'ont pas été modifiés après coup.
# Copié par la mise en place dans le projet : .projet/ci/verrous-tests.sh
# Usage (dans un job pull_request, checkout avec fetch-depth: 0) :
#   bash .projet/ci/verrous-tests.sh origin/<branche de base>
# Même empreinte que scripts/verrou-tests.mjs du plugin : contenu sans retours chariot, SHA-256.
set -euo pipefail

base="${1:?usage : verrous-tests.sh <ref de base>}"
echec=0
verrous="$(git diff --name-only --diff-filter=AM "$base"...HEAD -- '.projet/verrous/*.sha256' || true)"

if [ -z "$verrous" ]; then
  echo "Aucun verrou de tests dans cette PR."
  exit 0
fi

for verrou in $verrous; do
  echo "Verrou $verrou"
  while IFS= read -r ligne || [ -n "$ligne" ]; do
    ligne="${ligne%$'\r'}"
    case "$ligne" in ''|'#'*) continue ;; esac
    attendu="${ligne%%  *}"
    chemin="${ligne#*  }"
    if [ ! -f "$chemin" ]; then
      echo "  ✘ $chemin : supprimé"
      echec=1
      continue
    fi
    obtenu="$(tr -d '\r' < "$chemin" | sha256sum | cut -d' ' -f1)"
    if [ "$obtenu" = "$attendu" ]; then
      echo "  ✔ $chemin"
    else
      echo "  ✘ $chemin : modifié après verrouillage"
      echec=1
    fi
  done < "$verrou"
done

exit "$echec"
