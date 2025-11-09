# 🔧 Configuration Cloudflare Pages pour notary-site

## ⚠️ IMPORTANT : Configuration du Root Directory

Le projet `notary-site` est dans un sous-dossier du dépôt GitHub `new-site`. 

**Structure du dépôt :**
```
new-site/                    (racine du dépôt GitHub)
  └── notary-site/           (projet à déployer)
      ├── package.json       ← Le package.json est ici
      ├── functions/         ← Fonctions Cloudflare Pages
      └── public/            ← Fichiers publics
```

## ✅ Configuration dans Cloudflare Pages

### 1. Paramètres de Build

Dans **Settings** > **Builds & deployments**, configurez :

| Paramètre | Valeur |
|-----------|--------|
| **Root directory** | `notary-site` ⚠️ **OBLIGATOIRE** |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Framework preset** | `Vite` (ou laisser vide) |

### 2. Variables d'environnement

Dans **Settings** > **Environment Variables**, ajoutez :

| Variable | Description | Environnements |
|----------|-------------|----------------|
| `SUPABASE_URL` | URL de votre projet Supabase | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | Clé anonyme Supabase | Production, Preview, Development |

**Note :** Dans Cloudflare Pages Functions, utilisez `SUPABASE_URL` et `SUPABASE_ANON_KEY` (sans préfixe `VITE_`).

### 3. Sitemap dynamique

Le sitemap est généré automatiquement via la fonction Edge dans `functions/sitemap.xml.js`.

- **URL du sitemap :** `https://votre-domaine.pages.dev/sitemap.xml`
- **Cache :** 1 heure
- **Sources de données :** 
  - Services depuis la table `services`
  - Articles de blog depuis la table `blog_posts`

## 🚀 Déploiement

1. Connectez le dépôt GitHub `new-site` à Cloudflare Pages
2. Configurez le **Root directory** à `notary-site`
3. Ajoutez les variables d'environnement
4. Déployez !

## 📝 Fichiers de configuration

- `functions/sitemap.xml.js` - Génération du sitemap dynamique
- `functions/_middleware.js` - Middleware pour les headers de sécurité
- `public/_headers` - Headers HTTP personnalisés
- `public/_redirects` - Redirections SPA
- `wrangler.toml` - Configuration Cloudflare (optionnel)

## ✅ Vérification

Après le déploiement, vérifiez :
- ✅ Site accessible
- ✅ Sitemap accessible : `/sitemap.xml`
- ✅ Variables d'environnement fonctionnelles
- ✅ Supabase connecté

