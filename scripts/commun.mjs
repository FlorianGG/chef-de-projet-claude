// Fonctions partagées par les scripts du plugin « projet ». Aucune dépendance.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

export function racineDepot(depuis = process.cwd()) {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: depuis, encoding: 'utf8' }).trim();
  } catch {
    throw new Error("Ce dossier n'est pas un dépôt git.");
  }
}

export function lireConfig(racine) {
  const chemin = join(racine, '.projet', 'config.json');
  if (!existsSync(chemin)) {
    throw new Error(`Configuration introuvable : ${chemin}. Lancer /projet:nouveau d'abord.`);
  }
  return JSON.parse(readFileSync(chemin, 'utf8'));
}

export function dossierLocal(racine) {
  const dossier = join(racine, '.projet', 'local');
  mkdirSync(dossier, { recursive: true });
  return dossier;
}

export function assurerDossierParent(chemin) {
  mkdirSync(dirname(chemin), { recursive: true });
}

export function normaliser(chemin) {
  return chemin.replace(/\\/g, '/').replace(/^\.\//, '');
}

// Motifs de chemins : `**` = plusieurs segments (y compris aucun), `*` = un segment, `?` = un caractère.
export function motifVersRegex(motif) {
  const m = normaliser(motif);
  let source = '';
  for (let i = 0; i < m.length; i++) {
    const c = m[i];
    if (c === '*' && m[i + 1] === '*') {
      if (m[i + 2] === '/') {
        source += '(?:.*/)?';
        i += 2;
      } else {
        source += '.*';
        i += 1;
      }
    } else if (c === '*') {
      source += '[^/]*';
    } else if (c === '?') {
      source += '[^/]';
    } else {
      source += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${source}$`);
}

export function correspond(chemin, motifs = []) {
  const c = normaliser(chemin);
  return motifs.some((motif) => motifVersRegex(motif).test(c));
}

export function lireArguments(argv) {
  const options = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const cle = a.slice(2);
      const valeurs = [];
      while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        valeurs.push(argv[++i]);
      }
      options[cle] = valeurs.length === 0 ? true : valeurs.length === 1 ? valeurs[0] : valeurs;
    } else {
      options._.push(a);
    }
  }
  return options;
}

export function liste(valeur) {
  if (valeur === undefined || valeur === true) return [];
  return Array.isArray(valeur) ? valeur : [valeur];
}

export function quitterSurErreur(fonction) {
  try {
    fonction();
  } catch (erreur) {
    process.stderr.write(`Erreur : ${erreur.message}\n`);
    process.exit(2);
  }
}
