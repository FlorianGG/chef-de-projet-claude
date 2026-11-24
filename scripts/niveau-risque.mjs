#!/usr/bin/env node
// Calcule le niveau de risque plancher d'une tâche à partir des fichiers touchés.
// Usage :
//   node niveau-risque.mjs --fichiers a.ts b.tsx
//   node niveau-risque.mjs --depuis main        (diff de la branche + fichiers non suivis)
// Sortie : JSON { niveau, raisons, interface, donnees_perso, fichiers }
import { execFileSync } from 'node:child_process';
import { racineDepot, lireConfig, lireArguments, liste, correspond, normaliser, quitterSurErreur } from './commun.mjs';

function git(racine, args) {
  return execFileSync('git', args, { cwd: racine, encoding: 'utf8' })
    .split('\n').map((l) => l.trim()).filter(Boolean);
}

function fichiersDepuis(racine, ref) {
  const tous = new Set([
    ...git(racine, ['diff', '--name-only', `${ref}...HEAD`]),
    ...git(racine, ['diff', '--name-only']),
    ...git(racine, ['diff', '--name-only', '--cached']),
    ...git(racine, ['ls-files', '--others', '--exclude-standard']),
  ]);
  return [...tous].filter((f) => !normaliser(f).startsWith('.projet/local/'));
}

export function evaluer(fichiers, config) {
  const raisons = [];
  const sensibles = fichiers.filter((f) => correspond(f, config.chemins_sensibles));
  const perso = fichiers.filter((f) => correspond(f, config.chemins_donnees_perso));
  const ecrans = fichiers.filter((f) => correspond(f, config.chemins_interface));

  sensibles.forEach((f) => raisons.push(`${f} : chemin sensible`));
  perso.forEach((f) => raisons.push(`${f} : données personnelles`));
  ecrans.forEach((f) => raisons.push(`${f} : interface`));

  let niveau;
  if (sensibles.length > 0 || (config.rgpd && perso.length > 0)) {
    niveau = 'sensible';
  } else if (ecrans.length > 0 || perso.length > 0 || fichiers.length > 2) {
    niveau = 'normal';
  } else if (fichiers.length === 0) {
    niveau = 'normal';
    raisons.push('aucun fichier fourni : niveau normal par défaut');
  } else {
    niveau = 'simple';
    raisons.push(`${fichiers.length} fichier(s), ni sensible, ni interface, ni données personnelles`);
  }

  return {
    niveau,
    raisons,
    interface: ecrans.length > 0,
    donnees_perso: perso.length > 0,
    fichiers,
  };
}

quitterSurErreur(() => {
  const options = lireArguments(process.argv.slice(2));
  const racine = racineDepot();
  const config = lireConfig(racine);
  let fichiers = liste(options.fichiers);
  if (options.depuis) {
    fichiers = fichiersDepuis(racine, options.depuis);
  }
  const resultat = evaluer(fichiers.map(normaliser), config);
  process.stdout.write(`${JSON.stringify(resultat, null, 2)}\n`);
});
