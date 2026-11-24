#!/usr/bin/env node
// Ajoute un événement horodaté au journal du projet (.projet/local/journal.jsonl).
// Usage : node journal.mjs <tache|-> <evenement> ['{"cle":"valeur"}']
import { appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { racineDepot, dossierLocal, quitterSurErreur } from './commun.mjs';

const EVENEMENTS = new Set([
  'tri', 'spec', 'spec_validee', 'tests_ecrits', 'tests_verrouilles', 'code', 'controles',
  'relecture', 'contre_verification', 'tour', 'pr_ouverte', 'pr_validee',
  'question_personne', 'reponse_personne', 'probleme_tardif', 'fin_etape', 'bilan',
]);

quitterSurErreur(() => {
  const [tache, evenement, detailsTexte] = process.argv.slice(2);
  if (!tache || !evenement) {
    throw new Error("usage : node journal.mjs <tache|-> <evenement> ['<json>']");
  }
  if (!EVENEMENTS.has(evenement)) {
    throw new Error(`événement inconnu « ${evenement} ». Connus : ${[...EVENEMENTS].join(', ')}`);
  }
  const details = detailsTexte ? JSON.parse(detailsTexte) : {};
  const ligne = {
    ts: new Date().toISOString(),
    tache: tache === '-' ? null : Number.isNaN(Number(tache)) ? tache : Number(tache),
    evenement,
    details,
  };
  const fichier = join(dossierLocal(racineDepot()), 'journal.jsonl');
  appendFileSync(fichier, `${JSON.stringify(ligne)}\n`, 'utf8');
  process.stdout.write(`${fichier}\n`);
});
