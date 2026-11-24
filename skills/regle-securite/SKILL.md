---
name: regle-securite
description: "Règle du plugin projet : sécurité — secrets, entrées, requêtes, authentification, droits, dépendances, CI. Préchargée dans les agents qui codent ou relisent."
user-invocable: false
---

# Sécurité

- **Aucun secret dans le dépôt** : clés, mots de passe, jetons vont dans les variables d'environnement ou les secrets GitHub ; `.env` ignoré par git, `.env.example` versionné sans valeurs réelles.
- **Entrées** validées côté serveur, toujours, même si le front valide déjà.
- **Requêtes** paramétrées ; aucune concaténation de texte utilisateur dans du SQL, du HTML, une commande système ou un chemin de fichier.
- **Authentification** par une bibliothèque éprouvée, jamais maison ; sessions et jetons avec expiration ; limitation des tentatives.
- **Droits** vérifiés côté serveur à chaque accès à une ressource (pas seulement en masquant un bouton).
- **Dépendances** : versions figées (fichier de verrouillage versionné), mises à jour surveillées (Dependabot), aucune dépendance ajoutée sans raison écrite dans la tâche.
- **En-têtes HTTP** de sécurité (CSP, HSTS, X-Content-Type-Options, Referrer-Policy) pour tout ce qui est en ligne.
- **CI** : permissions minimales des workflows (`permissions:` explicite), actions tierces épinglées par version.
- **Erreurs** : message générique pour l'utilisateur, détail dans des journaux sans données personnelles.

Vérifié par `/security-review` sur chaque PR et par le skill `security-audit` de Cloudflare en fin d'étape.
