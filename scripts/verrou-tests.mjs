#!/usr/bin/env node
// Verrouille les tests écrits avant le code, puis vérifie qu'ils n'ont pas changé.
// Le verrou est versionné avec la branche (.projet/verrous/tache-<n>.sha256) et revérifié en CI.
// Format : une ligne « <sha256>  <chemin> » par fichier, lignes « # » ignorées. L'empreinte est
// calculée sur le contenu sans retours chariot, comme `tr -d '\r' < f | sha256sum` côté CI.
// Usage :
//   node verrou-tests.mjs sceller <verrou> <fichier> [<fichier>...]
//   node verrou-tests.mjs verifier <verrou>
// Code de sortie : 0 = OK, 1 = test modifié ou supprimé, 2 = erreur d'usage.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, isAbsolute } from 'node:path';
import { racineDepot, normaliser, assurerDossierParent, quitterSurErreur } from './commun.mjs';

export function empreinte(chemin) {
  const contenu = readFileSync(chemin).filter((octet) => octet !== 0x0d);
  return createHash('sha256').update(contenu).digest('hex');
}

function relatif(racine, fichier) {
  const absolu = isAbsolute(fichier) ? fichier : join(process.cwd(), fichier);
  return normaliser(relative(racine, absolu));
}

export function lireVerrou(texte) {
  return texte
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => {
      const m = l.match(/^([0-9a-f]{64}) [ *](.+)$/);
      if (!m) throw new Error(`ligne de verrou illisible : ${l}`);
      return { hash: m[1], chemin: m[2] };
    });
}

function sceller(racine, verrou, fichiers) {
  if (fichiers.length === 0) throw new Error('aucun fichier de test à sceller');
  const lignes = [`# tests verrouillés le ${new Date().toISOString()}`];
  for (const fichier of fichiers) {
    const rel = relatif(racine, fichier);
    const absolu = join(racine, rel);
    if (!existsSync(absolu)) throw new Error(`fichier introuvable : ${rel}`);
    lignes.push(`${empreinte(absolu)}  ${rel}`);
  }
  assurerDossierParent(verrou);
  writeFileSync(verrou, `${lignes.join('\n')}\n`);
  process.stdout.write(`${fichiers.length} fichier(s) de test scellé(s) dans ${verrou}\n`);
  return 0;
}

function verifier(racine, verrou) {
  if (!existsSync(verrou)) throw new Error(`verrou introuvable : ${verrou}`);
  const entrees = lireVerrou(readFileSync(verrou, 'utf8'));
  const problemes = [];
  for (const { hash, chemin } of entrees) {
    const absolu = join(racine, chemin);
    if (!existsSync(absolu)) problemes.push(`${chemin} : supprimé`);
    else if (empreinte(absolu) !== hash) problemes.push(`${chemin} : modifié après verrouillage`);
  }
  if (problemes.length > 0) {
    process.stdout.write(`Tests verrouillés touchés :\n${problemes.map((p) => `- ${p}`).join('\n')}\n`);
    return 1;
  }
  process.stdout.write(`${entrees.length} fichier(s) de test intacts.\n`);
  return 0;
}

quitterSurErreur(() => {
  const [action, verrou, ...fichiers] = process.argv.slice(2);
  if (!action || !verrou) {
    throw new Error('usage : node verrou-tests.mjs sceller|verifier <verrou> [fichiers...]');
  }
  const racine = racineDepot();
  if (action === 'sceller') process.exit(sceller(racine, verrou, fichiers));
  if (action === 'verifier') process.exit(verifier(racine, verrou));
  throw new Error(`action inconnue « ${action} »`);
});
