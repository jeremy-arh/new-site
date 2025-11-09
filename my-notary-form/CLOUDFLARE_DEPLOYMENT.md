# Guide de déploiement sur Cloudflare Pages

Ce guide vous explique comment déployer l'application my-notary-form sur Cloudflare Pages.

## Prérequis

1. Un compte Cloudflare (gratuit)
2. Un projet Supabase configuré
3. Git (pour connecter le dépôt GitHub)

## Configuration

### 1. Variables d'environnement

Dans le dashboard Cloudflare Pages, ajoutez les variables d'environnement suivantes :

- `VITE_SUPABASE_URL` : L'URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` : La clé anonyme de votre projet Supabase

**Comment ajouter des variables d'environnement :**
1. Allez dans votre projet Cloudflare Pages
2. Cliquez sur "Settings" > "Environment Variables"
3. Ajoutez les variables pour "Production", "Preview", et "Development"

### 2. Configuration du build

**⚠️ IMPORTANT :** Comme le projet est dans un sous-dossier `my-notary-form` du dépôt GitHub, vous devez configurer le **Root directory** dans Cloudflare Pages.

Le projet est configuré avec :
- **Root directory** : `my-notary-form` ⚠️ **OBLIGATOIRE**
- **Build command** : `npm run build`
- **Build output directory** : `dist`

### 3. Sitemap dynamique

Le sitemap est généré dynamiquement via une Cloudflare Pages Function dans `functions/sitemap.xml.js`.

La fonction :
- Récupère les articles de blog depuis la table `blog_posts` (si elle existe)
- Récupère les services depuis la table `services` (si elle existe)
- Génère un sitemap.xml à la volée

Le sitemap est accessible à : `https://votre-domaine.pages.dev/sitemap.xml`

## Déploiement

### Option 1 : Via GitHub (Recommandé)

1. **Connecter le dépôt GitHub :**
   - Dans Cloudflare Pages, cliquez sur "Create a project"
   - Sélectionnez "Connect to Git"
   - Choisissez votre dépôt `my-notary-form`

2. **Configurer le build :**
   - **Root directory** : `my-notary-form` ⚠️ **IMPORTANT - Le projet est dans un sous-dossier**
   - **Framework preset** : Vite
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`

3. **Ajouter les variables d'environnement :**
   - Allez dans "Settings" > "Environment Variables"
   - Ajoutez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

4. **Déployer :**
   - Cliquez sur "Save and Deploy"
   - Cloudflare construira et déploiera automatiquement votre site

### Option 2 : Via Wrangler CLI

1. **Installer Wrangler :**
   ```bash
   npm install -g wrangler
   ```

2. **Se connecter à Cloudflare :**
   ```bash
   wrangler login
   ```

3. **Configurer les variables d'environnement :**
   ```bash
   wrangler pages secret put VITE_SUPABASE_URL
   wrangler pages secret put VITE_SUPABASE_ANON_KEY
   ```

4. **Construire le projet :**
   ```bash
   npm run build
   ```

5. **Déployer :**
   ```bash
   wrangler pages deploy dist --project-name=my-notary-form
   ```

## Structure des fichiers Cloudflare

```
my-notary-form/
├── functions/
│   ├── sitemap.xml.js          # Fonction Edge pour générer le sitemap dynamique
│   └── _middleware.js          # Middleware global pour les headers de sécurité
├── public/
│   ├── _headers                 # En-têtes HTTP personnalisés
│   ├── _redirects               # Règles de redirection (SPA routing)
│   └── robots.txt               # Configuration robots.txt
├── wrangler.toml                # Configuration Cloudflare (optionnel pour Pages)
├── cloudflare-pages.json        # Configuration Cloudflare Pages
├── .cfignore                    # Fichiers à ignorer lors du déploiement
└── vite.config.js               # Configuration Vite optimisée pour Cloudflare
```

## Fonctionnalités Cloudflare activées

### 1. Sitemap dynamique
- Généré automatiquement depuis Supabase
- Mise en cache pendant 1 heure
- Accessible à `/sitemap.xml`

### 2. En-têtes de sécurité
- Protection XSS
- Protection contre le clickjacking
- Headers de sécurité configurés dans `public/_headers`

### 3. Cache optimisé
- Assets statiques : cache de 1 an
- HTML : pas de cache
- Sitemap : cache de 1 heure

### 4. Redirections SPA
- Toutes les routes redirigent vers `index.html` pour le routing React

## Vérification post-déploiement

1. **Vérifier le site :**
   - Visitez l'URL fournie par Cloudflare Pages
   - Vérifiez que l'application se charge correctement

2. **Vérifier le sitemap :**
   - Visitez `https://votre-domaine.pages.dev/sitemap.xml`
   - Vérifiez que les URLs sont correctement générées

3. **Vérifier les variables d'environnement :**
   - Vérifiez que Supabase fonctionne correctement
   - Consultez la console du navigateur pour les erreurs

## Mise à jour du sitemap

Le sitemap est généré automatiquement à chaque requête. Les données sont mises en cache pendant 1 heure pour optimiser les performances.

Pour forcer une régénération immédiate, vous pouvez :
1. Vider le cache Cloudflare
2. Attendre l'expiration du cache (1 heure)

## Dépannage

### Le sitemap ne fonctionne pas

1. Vérifiez que les variables d'environnement sont bien configurées
2. Vérifiez que la fonction `functions/sitemap.xml.js` est présente
3. Vérifiez les logs dans Cloudflare Pages > Functions

### Les variables d'environnement ne sont pas disponibles

1. Vérifiez que les variables sont définies dans Cloudflare Pages
2. Redéployez le projet après avoir ajouté les variables
3. Les variables doivent être préfixées par `VITE_` pour être accessibles côté client

### Le build échoue

1. Vérifiez les logs de build dans Cloudflare Pages
2. Testez le build localement : `npm run build`
3. Vérifiez que toutes les dépendances sont dans `package.json`

## Support

Pour plus d'informations :
- [Documentation Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Documentation Supabase](https://supabase.com/docs)

