#!/usr/bin/env node
// Calcule les mesures du projet à partir du journal.
// Usage : node mesures.mjs <journal.jsonl> [--json]
// Détails attendus dans les événements : voir skills/orchestrateur/fichiers.md.
import { existsSync, readFileSync } from 'node:fs';
import { lireArguments, quitterSurErreur } from './commun.mjs';

function lireJournal(chemin) {
  if (!existsSync(chemin)) throw new Error(`journal introuvable : ${chemin}`);
  return readFileSync(chemin, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((l, i) => {
      try {
        return JSON.parse(l);
      } catch {
        throw new Error(`ligne ${i + 1} du journal illisible`);
      }
    });
}

function ajouter(objet, cle, n = 1) {
  objet[cle] = (objet[cle] ?? 0) + n;
}

export function calculer(evenements) {
  const taches = new Map();
  const constatsParRelecteur = {};
  const confirmesParRelecteur = {};
  const ecartesParRelecteur = {};
  const tardifsParCategorie = {};
  const tardifsParSource = {};
  let questions = 0;
  let attenteMs = 0;
  const questionsOuvertes = new Map();
  let controlesEchoues = 0;
  let controlesLances = 0;

  for (const e of evenements) {
    const d = e.details ?? {};
    if (e.tache !== null && e.tache !== undefined && !taches.has(e.tache)) {
      taches.set(e.tache, { tours: 0, validee: false, debut: e.ts, fin: null });
    }
    const t = taches.get(e.tache);
    switch (e.evenement) {
      case 'tour':
        if (t) t.tours = Math.max(t.tours, Number(d.tour ?? t.tours + 1));
        break;
      case 'relecture':
        ajouter(constatsParRelecteur, d.relecteur ?? 'inconnu', Number(d.bloquants ?? 0) + Number(d.importants ?? 0) + Number(d.mineurs ?? 0));
        break;
      case 'contre_verification':
        for (const [r, n] of Object.entries(d.confirmes ?? {})) ajouter(confirmesParRelecteur, r, Number(n));
        for (const [r, n] of Object.entries(d.ecartes ?? {})) ajouter(ecartesParRelecteur, r, Number(n));
        break;
      case 'probleme_tardif':
        ajouter(tardifsParCategorie, d.categorie ?? 'non précisée');
        ajouter(tardifsParSource, d.source ?? 'non précisée');
        break;
      case 'question_personne':
        questions += 1;
        questionsOuvertes.set(e.tache, e.ts);
        break;
      case 'reponse_personne':
        if (questionsOuvertes.has(e.tache)) {
          attenteMs += new Date(e.ts) - new Date(questionsOuvertes.get(e.tache));
          questionsOuvertes.delete(e.tache);
        }
        break;
      case 'controles':
        controlesLances += 1;
        if (d.ok === false) controlesEchoues += 1;
        break;
      case 'pr_validee':
        if (t) {
          t.validee = true;
          t.fin = e.ts;
        }
        break;
      default:
        break;
    }
  }

  const validees = [...taches.values()].filter((t) => t.validee);
  const moyenne = (valeurs) => (valeurs.length ? valeurs.reduce((a, b) => a + b, 0) / valeurs.length : null);
  const partEcartes = {};
  for (const r of new Set([...Object.keys(confirmesParRelecteur), ...Object.keys(ecartesParRelecteur)])) {
    const c = confirmesParRelecteur[r] ?? 0;
    const x = ecartesParRelecteur[r] ?? 0;
    partEcartes[r] = c + x ? Math.round((x / (c + x)) * 100) : null;
  }

  return {
    taches_suivies: taches.size,
    taches_validees: validees.length,
    tours_moyens: moyenne([...taches.values()].map((t) => t.tours)),
    duree_moyenne_heures: moyenne(validees.map((t) => (new Date(t.fin) - new Date(t.debut)) / 36e5)),
    controles: { lances: controlesLances, echoues: controlesEchoues },
    constats_par_relecteur: constatsParRelecteur,
    part_constats_ecartes_pct: partEcartes,
    problemes_tardifs: { par_categorie: tardifsParCategorie, par_source: tardifsParSource },
    questions_personne: questions,
    attente_reponses_heures: Math.round((attenteMs / 36e5) * 10) / 10,
    assez_de_donnees: validees.length >= 5,
  };
}

function enTexte(m) {
  const arrondi = (n) => (n === null ? '—' : Math.round(n * 10) / 10);
  const lignes = [
    '| Mesure | Valeur |',
    '| --- | --- |',
    `| Tâches suivies / validées | ${m.taches_suivies} / ${m.taches_validees} |`,
    `| Tours de correction moyens | ${arrondi(m.tours_moyens)} |`,
    `| Durée moyenne d'une tâche (h) | ${arrondi(m.duree_moyenne_heures)} |`,
    `| Contrôles lancés / en échec | ${m.controles.lances} / ${m.controles.echoues} |`,
    `| Questions posées à la personne | ${m.questions_personne} |`,
    `| Attente des réponses (h) | ${m.attente_reponses_heures} |`,
  ];
  for (const [r, n] of Object.entries(m.constats_par_relecteur)) {
    lignes.push(`| Constats ${r} (écartés) | ${n} (${m.part_constats_ecartes_pct[r] ?? '—'} %) |`);
  }
  for (const [c, n] of Object.entries(m.problemes_tardifs.par_categorie)) {
    lignes.push(`| Problèmes tardifs : ${c} | ${n} |`);
  }
  if (!m.assez_de_donnees) lignes.push('', 'Moins de cinq tâches validées : trop tôt pour conclure.');
  return `${lignes.join('\n')}\n`;
}

quitterSurErreur(() => {
  const options = lireArguments(process.argv.slice(2));
  const [chemin] = options._;
  if (!chemin) throw new Error('usage : node mesures.mjs <journal.jsonl> [--json]');
  const mesures = calculer(lireJournal(chemin));
  process.stdout.write(options.json ? `${JSON.stringify(mesures, null, 2)}\n` : enTexte(mesures));
});
