# Guide de Déploiement Netlify

Ce document explique comment déployer l'application Notary sur Netlify.

## Prérequis

1. Compte Netlify (gratuit sur https://netlify.com)
2. Repository Git connecté (GitHub, GitLab, ou Bitbucket)
3. Variables d'environnement Supabase configurées

## Configuration Automatique

Le projet est déjà configuré pour Netlify avec :
- `netlify.toml` - Configuration de build et redirections
- `public/_redirects` - Redirections pour React Router
- Build command: `npm run build`
- Publish directory: `dist`

## Déploiement via Netlify UI

### 1. Connexion du Repository

1. Connectez-vous à Netlify
2. Cliquez sur "Add new site" > "Import an existing project"
3. Choisissez votre provider Git (GitHub/GitLab/Bitbucket)
4. Sélectionnez le repository `new-site`
5. Choisissez la branche principale pour le déploiement

### 2. Configuration du Build

Netlify détectera automatiquement la configuration depuis `netlify.toml` :

```toml
Build command: npm run build
Publish directory: dist
Node version: 18
```

### 3. Variables d'Environnement

**IMPORTANT** : Ajoutez vos variables d'environnement dans Netlify :

1. Allez dans "Site settings" > "Environment variables"
2. Ajoutez les variables suivantes :

```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_publique_supabase
```

**Note** : Ces valeurs se trouvent dans votre projet Supabase sous "Settings" > "API"

### 4. Déploiement

1. Cliquez sur "Deploy site"
2. Netlify va :
   - Installer les dépendances (`npm install`)
   - Exécuter le build (`npm run build`)
   - Publier le dossier `dist`

## Déploiement via Netlify CLI

### Installation

```bash
npm install -g netlify-cli
netlify login
```

### Build et Déploiement

```bash
# Build local
cd notary-site
npm run build

# Déploiement
netlify deploy --prod
```

## Configuration DNS (Domaine Personnalisé)

### Ajouter un Domaine

1. Allez dans "Site settings" > "Domain management"
2. Cliquez sur "Add custom domain"
3. Entrez votre domaine
4. Suivez les instructions pour configurer les DNS

### Configuration DNS Recommandée

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: votre-site.netlify.app
```

## Fonctionnalités Netlify Activées

### ✅ Redirections SPA
- Toutes les routes (`/*`) redirigent vers `index.html`
- Permet à React Router de gérer le routing côté client

### ✅ Build Automatique
- Déploiement automatique à chaque push sur la branche principale
- Preview deployments pour les pull requests

### ✅ HTTPS Automatique
- Certificat SSL gratuit via Let's Encrypt
- Force HTTPS activé par défaut

## Structure du Projet

```
notary-site/
├── netlify.toml           # Configuration Netlify
├── public/
│   └── _redirects         # Redirections pour SPA
├── dist/                  # Build output (généré)
└── src/                   # Code source
```

## Vérification Post-Déploiement

Après le déploiement, vérifiez :

1. ✅ Page d'accueil se charge
2. ✅ Navigation entre les pages fonctionne
3. ✅ Services sont récupérés depuis Supabase
4. ✅ Blog affiche les articles
5. ✅ Routes directes fonctionnent (ex: `/services/apostille`)
6. ✅ Mobile CTA apparaît au scroll

## Dépannage

### Build Échoue

**Erreur** : `npm install` failed
**Solution** : Vérifiez que `package.json` est commité et que toutes les dépendances sont listées

**Erreur** : `npm run build` failed
**Solution** : Testez le build localement avec `npm run build`

### Pages 404 sur Refresh

**Problème** : Rafraîchir une page donne une erreur 404
**Solution** : Vérifiez que `_redirects` est dans `public/` et que `netlify.toml` contient les redirections

### Variables d'Environnement Non Définies

**Problème** : Les données Supabase ne se chargent pas
**Solution** : Vérifiez que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont définis dans Netlify

### Images ou Assets Manquants

**Problème** : Images ou fichiers statiques ne se chargent pas
**Solution** : Vérifiez que les chemins sont relatifs et commencent par `/` ou utilisent des imports

## Performance

### Optimisations Automatiques Netlify

- ✅ Compression Brotli/Gzip
- ✅ CDN global
- ✅ Cache des assets statiques
- ✅ Minification HTML/CSS/JS (via Vite)

### Optimisations Recommandées

1. **Images** : Utilisez des formats modernes (WebP, AVIF)
2. **Code Splitting** : Vite le fait automatiquement
3. **Lazy Loading** : Implémenté pour les routes
4. **Cache Control** : Géré automatiquement par Netlify

## Monitoring

### Netlify Analytics (Optionnel)

Activez Netlify Analytics pour :
- Statistiques de trafic
- Performance des pages
- Données de navigation

### Logs de Build

Consultez les logs dans :
- "Deploys" > Sélectionner un déploiement > "Deploy log"

## Support

- Documentation Netlify : https://docs.netlify.com
- Documentation Vite : https://vitejs.dev
- Documentation React Router : https://reactrouter.com

## Commandes Utiles

```bash
# Build local
npm run build

# Preview local du build
npm run preview

# Lint
npm run lint

# Déploiement Netlify CLI
netlify deploy --prod

# Voir les logs Netlify
netlify logs

# Ouvrir le dashboard
netlify open
```

## Checklist de Déploiement

- [ ] Variables d'environnement Supabase configurées
- [ ] Build local réussi (`npm run build`)
- [ ] Repository Git à jour
- [ ] `netlify.toml` commité
- [ ] `public/_redirects` commité
- [ ] Branch de déploiement sélectionnée
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] HTTPS activé
- [ ] Test de toutes les routes
- [ ] Test sur mobile
- [ ] Vérification des données Supabase

## Notes Importantes

⚠️ **Ne jamais commiter les secrets** : Les clés Supabase dans `.env` ne doivent JAMAIS être commitées. Utilisez toujours les variables d'environnement Netlify.

✅ **Vite Prefix** : Les variables d'environnement Vite doivent commencer par `VITE_` pour être accessibles côté client.

✅ **Rebuilds Automatiques** : Netlify rebuild automatiquement à chaque push. Pas besoin de redéployer manuellement.
