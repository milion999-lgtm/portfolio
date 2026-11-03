# Suivi Cotisation — configuration Supabase

## Modèle d'accès

- Les comptes sont des comptes administrateur. Les stagiaires n'ont ni compte ni accès au site.
- Chaque compte admin possède sa propre liste, ses photos et son état financier; les autres comptes ne peuvent pas les lire ni les modifier.
- Chaque administrateur doit définir le nom de sa classe avant d'utiliser le suivi. Ce nom est enregistré avec son espace et apparaît dans ses PDF.
- Supabase Auth gère les mots de passe et la confirmation email. Le navigateur ne conserve pas la session d'authentification dans `localStorage`; après un rechargement, l'administrateur se reconnecte.
- Les images sont ré-encodées en JPEG dans le navigateur, stockées dans un bucket privé et servies par des URL signées temporaires.
- Les tables financières sont protégées par RLS. Les écritures financières passent par une fonction versionnée qui conserve les sauvegardes précédentes et refuse un enregistrement concurrent obsolète.
- Les exports PDF et JSON sont générés dans le navigateur à la demande. Ils contiennent des informations personnelles: ne les partage qu'avec les personnes autorisées.

## État actuel du projet

- Organisation dédiée : `Suivi Cotisation FREE`.
- Projet dédié : `suivi-cotisation` (`yhplxbpumzcgkteixmly`), région West EU (Ireland).
- `schema.sql` a été exécuté avec succès. Les tables `participants`, `workspace_states` et `workspace_state_backups` sont visibles dans le Table Editor. Le bucket privé `participant-photos` et ses politiques existent.
- Les inscriptions publiques et les connexions anonymes sont désactivées; la confirmation email est activée.
- La clé publique publishable et l'URL du nouveau projet sont configurées dans `supabase-config.js`. Aucune clé secrète n'est intégrée au navigateur.
- Le mot de passe minimal a été réglé à 12 caractères avec minuscules, majuscules, chiffres et symboles.
- Aucune donnée n'a été supprimée par le script; les anciennes sauvegardes ne sont pas purgées automatiquement.

## Étapes restantes avant l'utilisation publique

1. Ajouter les comptes administrateurs autorisés dans Supabase Auth > Users. Les inscriptions publiques sont coupées; aucun compte stagiaire n'est prévu. Ne partage pas les mots de passe dans un chat.
2. Configurer un SMTP de production dans Auth pour les emails de confirmation et de récupération. Les identifiants SMTP restent uniquement dans les paramètres Supabase.
3. Déployer uniquement le contenu de ce dossier (`secure-online`) sur un hébergeur HTTPS. `vercel.json` ajoute CSP, HSTS, anti-iframe, no-sniff et politique de référent.
4. Une fois l'adresse du site connue, l'ajouter dans Auth > URL Configuration (Site URL et Redirect URLs). N'autoriser que le domaine de production et localhost si un environnement local est utilisé.
5. Avant de partager le site, contrôler les règles d'accès par compte et le flux connexion, récupération, ajout/archivage et export PDF.

## Données et sauvegardes

`workspace_state_backups` conserve les versions financières précédentes par compte. La liste et les références photo sont stockées séparément. Activer et vérifier les sauvegardes du projet Supabase, puis faire périodiquement un test de restauration. Les versions de sauvegarde ont les mêmes politiques d'accès par compte.

## Publication

Le backend Supabase et le schéma sont prêts dans le nouveau projet. Le site n'est pas encore publié, aucun compte admin n'a été créé et aucun SMTP ni domaine de production n'est configuré. Il n'existe donc pas encore de lien public utilisable. L'ancien projet EduVerse et la base locale originale sont séparés et n'ont pas été modifiés.
