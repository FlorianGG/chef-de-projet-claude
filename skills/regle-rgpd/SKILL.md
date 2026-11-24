---
name: regle-rgpd
description: "Règle du plugin projet : RGPD — conception, code, fin d'étape. Préchargée dans les agents qui touchent des données personnelles."
user-invocable: false
---

# RGPD

S'applique dès que le projet traite des données personnelles : toute information qui permet d'identifier une personne, directement ou non (nom, e-mail, téléphone, adresse IP, identifiant de compte, localisation, photo…). Les données sensibles (santé, opinions, origine, biométrie, vie sexuelle, condamnations) imposent une vigilance renforcée et souvent une analyse d'impact (AIPD).

Ce que vérifient les agents n'est pas un avis juridique ; en cas de doute sérieux, recommander un juriste ou le DPO.

## À la conception

- **Minimisation** : chaque donnée collectée a une finalité écrite ; sinon on ne la collecte pas.
- **Base légale** par traitement (contrat, consentement, obligation légale, intérêt légitime…).
- **Durée de conservation** par donnée, et mécanisme de purge prévu dès le départ.
- **Sous-traitants** : hébergeur, envoi d'e-mails, analytics, paiement… et pays d'hébergement (hors UE → garanties à documenter).
- **Registre** des traitements dans `docs/rgpd/registre.md` (modèle dans `modeles/rgpd-registre.md` du plugin).

## Dans le code

- Pas de données personnelles dans les journaux, les messages d'erreur, les URL ou les outils d'analyse.
- Mots de passe hachés avec un algorithme adapté (Argon2id, bcrypt, scrypt) ; jamais stockés ni journalisés en clair.
- Données sensibles chiffrées au repos si l'hébergement le permet ; HTTPS partout.
- Droits des personnes réalisables : accès / export, rectification, effacement (y compris dans les sauvegardes, à documenter), opposition.
- Cookies et traceurs non essentiels : consentement préalable, refus aussi simple qu'accepter, aucun dépôt avant le choix.
- Formulaires : mention d'information au point de collecte (qui, pourquoi, combien de temps, droits).
- Données de test et de démonstration : fictives, jamais copiées de la production.

## En fin d'étape

Registre à jour avec ce qui a été livré ; durées de conservation effectivement appliquées ; parcours d'export et d'effacement testés ; inventaire des cookies et traceurs.
