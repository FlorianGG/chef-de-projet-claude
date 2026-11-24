#!/usr/bin/env node
// Lance les contrôles automatiques du projet dans l'ordre de .projet/config.json → controles,
// du moins cher au plus cher, et s'arrête au premier échec.
// Usage : node controles.mjs [--sortie <controles.json>] [--seulement nom1 nom2] [--lignes 60]
// Code de sortie : 0 = tout vert, 1 = un contrôle en échec, 2 = erreur.
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { racineDepot, lireConfig, lireArguments, liste, assurerDossierParent, quitterSurErreur } from './commun.mjs';

function finDeJournal(texte, lignes) {
  return texte.split(/\r?\n/).slice(-lignes).join('\n');
}

quitterSurErreur(() => {
  const options = lireArguments(process.argv.slice(2));
  const racine = racineDepot();
  const config = lireConfig(racine);
  const seulement = liste(options.seulement);
  const nbLignes = Number(options.lignes ?? 60);

  const aLancer = (config.controles ?? []).filter((c) => seulement.length === 0 || seulement.includes(c.nom));
  if (aLancer.length === 0) throw new Error('aucun contrôle défini dans .projet/config.json → controles');

  const resultats = [];
  let echec = null;
  for (const controle of aLancer) {
    const debut = Date.now();
    const execution = spawnSync(controle.commande, {
      cwd: racine,
      shell: true,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    const ok = execution.status === 0;
    const resultat = { nom: controle.nom, commande: controle.commande, ok, code: execution.status, duree_ms: Date.now() - debut };
    resultats.push(resultat);
    process.stdout.write(`${ok ? '✔' : '✘'} ${controle.nom} (${resultat.duree_ms} ms)\n`);
    if (!ok) {
      const sortie = `${execution.stdout ?? ''}\n${execution.stderr ?? ''}${execution.error ? `\n${execution.error.message}` : ''}`;
      echec = { nom: controle.nom, fin_journal: finDeJournal(sortie.trim(), nbLignes) };
      break;
    }
  }

  const rapport = {
    ok: echec === null,
    date: new Date().toISOString(),
    controles: resultats,
    non_lances: aLancer.slice(resultats.length).map((c) => c.nom),
    echec,
  };
  if (options.sortie) {
    assurerDossierParent(options.sortie);
    writeFileSync(options.sortie, `${JSON.stringify(rapport, null, 2)}\n`);
  }
  if (echec) process.stdout.write(`\nÉchec de « ${echec.nom} » :\n${echec.fin_journal}\n`);
  process.exit(echec ? 1 : 0);
});
