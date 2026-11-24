#!/usr/bin/env node
// Vérifie que les relecteurs retrouvent les pièges connus (boucle longue). Pas de juge IA :
// un piège est trouvé si un constat tombe dans le bon fichier, recoupe la plage de lignes
// et porte la bonne catégorie.
// Usage : node rejouer-pieges.mjs <dossier pieges> <dossier rejeu> [--comparer <rapport precedent.json>] [--sortie <rapport.json>]
//   <dossier rejeu>/<id>/<essai>.json = constats rendus par le relecteur à chaque essai.
// Code de sortie : 0 = OK, 1 = un piège trouvé dans le rapport précédent est raté maintenant, 2 = erreur.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { lireArguments, normaliser, assurerDossierParent, quitterSurErreur } from './commun.mjs';

function lireJson(chemin) {
  return JSON.parse(readFileSync(chemin, 'utf8'));
}

function recoupe([a1, a2], [b1, b2]) {
  return a1 <= b2 && b1 <= a2;
}

export function trouve(piege, constats) {
  return (constats ?? []).some((c) =>
    normaliser(c.fichier ?? '') === normaliser(piege.fichier)
    && Array.isArray(c.lignes)
    && recoupe(c.lignes, piege.lignes)
    && c.categorie === piege.categorie);
}

function evaluer(dossierPieges, dossierRejeu) {
  const resultats = [];
  for (const id of readdirSync(dossierPieges, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)) {
    const cheminPiege = join(dossierPieges, id, 'piege.json');
    if (!existsSync(cheminPiege)) continue;
    const piege = lireJson(cheminPiege);
    if (piege.statut && piege.statut !== 'accepte') continue;
    const dossierEssais = join(dossierRejeu, id);
    const essais = existsSync(dossierEssais)
      ? readdirSync(dossierEssais).filter((f) => f.endsWith('.json')).map((f) => lireJson(join(dossierEssais, f)))
      : [];
    const trouves = essais.filter((e) => trouve(piege, e.constats)).length;
    resultats.push({
      id,
      relecteur: piege.relecteur,
      categorie: piege.categorie,
      essais: essais.length,
      trouves,
      taux: essais.length ? trouves / essais.length : null,
    });
  }
  return resultats;
}

function parRelecteur(resultats) {
  const agregat = {};
  for (const r of resultats.filter((x) => x.essais > 0)) {
    agregat[r.relecteur] ??= { pieges: 0, essais: 0, trouves: 0 };
    agregat[r.relecteur].pieges += 1;
    agregat[r.relecteur].essais += r.essais;
    agregat[r.relecteur].trouves += r.trouves;
  }
  for (const a of Object.values(agregat)) a.taux = Math.round((a.trouves / a.essais) * 100);
  return agregat;
}

quitterSurErreur(() => {
  const options = lireArguments(process.argv.slice(2));
  const [dossierPieges, dossierRejeu] = options._;
  if (!dossierPieges || !dossierRejeu) {
    throw new Error('usage : node rejouer-pieges.mjs <dossier pieges> <dossier rejeu> [--comparer <rapport.json>] [--sortie <rapport.json>]');
  }
  const resultats = evaluer(dossierPieges, dossierRejeu);
  const rapport = {
    date: new Date().toISOString(),
    pieges: resultats.length,
    sans_essai: resultats.filter((r) => r.essais === 0).map((r) => r.id),
    par_relecteur: parRelecteur(resultats),
    resultats,
    regressions: [],
    assez_de_pieges: resultats.length >= 20,
  };

  if (options.comparer) {
    const precedent = lireJson(options.comparer);
    const avant = new Map(precedent.resultats.map((r) => [r.id, r]));
    rapport.regressions = resultats
      .filter((r) => (avant.get(r.id)?.trouves ?? 0) > 0 && r.essais > 0 && r.trouves === 0)
      .map((r) => r.id);
  }

  if (options.sortie) {
    assurerDossierParent(options.sortie);
    writeFileSync(options.sortie, `${JSON.stringify(rapport, null, 2)}\n`);
  }

  process.stdout.write(`Pièges rejoués : ${rapport.pieges}\n`);
  for (const [r, a] of Object.entries(rapport.par_relecteur)) {
    process.stdout.write(`- ${r} : ${a.taux} % (${a.trouves}/${a.essais} essais, ${a.pieges} pièges)\n`);
  }
  if (rapport.sans_essai.length) process.stdout.write(`Sans essai : ${rapport.sans_essai.join(', ')}\n`);
  if (!rapport.assez_de_pieges) process.stdout.write('Moins de 20 pièges : taux indicatifs seulement.\n');
  if (rapport.regressions.length) {
    process.stdout.write(`Régressions (trouvés avant, ratés maintenant) : ${rapport.regressions.join(', ')}\n`);
    process.exit(1);
  }
});
