---
name: etat
description: Montre où en est le projet — étape en cours, tâches faites et restantes, PR en attente de merge, points bloqués.
disable-model-invocation: true
---

# /projet:etat

1. Charger le skill `projet:orchestrateur` ; lire `github.md` dans son dossier.
2. Lire `.projet/config.json`, `.projet/local/etat.json` et l'état GitHub (milestones, issues, PR ouvertes avec l'état de leur CI).
3. Répondre court :
   - étape en cours et avancement (« 4 tâches sur 7 ») ;
   - ce qui attend la personne en premier : PR à relire et merger (avec lien), questions en suspens (label `bloque`), candidats pièges à trier ;
   - prochaine tâche prévue ;
   - niveau de confiance actuel.
4. Si l'état local et GitHub divergent : GitHub fait foi ; mettre `etat.json` à jour et le signaler.
