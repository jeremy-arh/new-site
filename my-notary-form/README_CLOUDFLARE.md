# Configuration Cloudflare Pages - my-notary-form

## ✅ Fichiers de configuration créés

Tous les fichiers nécessaires pour déployer sur Cloudflare Pages ont été créés :

### 📁 Fichiers de configuration

1. **`wrangler.toml`** - Configuration Cloudflare (optionnel pour Pages, utile pour CLI)
2. **`cloudflare-pages.json`** - Configuration spécifique Cloudflare Pages
3. **`.cfignore`** - Fichiers à ignorer lors du déploiement

### 🔧 Fonctions Edge (Cloudflare Pages Functions)

1. **`functions/sitemap.xml.js`** - Génère le sitemap.xml dynamiquement depuis Supabase
2. **`functions/_middleware.js`** - Middleware global pour les headers de sécurité

### 📄 Fichiers publics

1. **`public/_headers`** - En-têtes HTTP personnalisés (sécurité, cache)
2. **`public/_redirects`** - Règles de redirection pour le SPA routing
3. **`public/robots.txt`** - Configuration robots.txt

### ⚙️ Configuration Vite

- **`vite.config.js`** - Optimisé pour Cloudflare avec code splitting

## 🚀 Déploiement

### Méthode 1 : Via GitHub (Recommandé)

1. Connectez votre dépôt GitHub à Cloudflare Pages
2. Configurez les variables d'environnement dans Cloudflare Dashboard
3. Déployez automatiquement

Voir `DEPLOY_QUICK_START.md` pour les instructions détaillées.

### Méthode 2 : Via Wrangler CLI

```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name=my-notary-form
```

## 🔑 Variables d'environnement requises

Dans Cloudflare Pages Dashboard > Settings > Environment Variables :

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | URL de votre projet Supabase |
| `SUPABASE_ANON_KEY` | Clé anonyme Supabase |

**Note :** Dans Cloudflare Pages Functions, les variables sont accessibles sans préfixe `VITE_`.

## 🗺️ Sitemap dynamique

Le sitemap est généré automatiquement et inclut :

- ✅ Page d'accueil (priorité 1.0)
- ✅ Services depuis la table `services` (si disponible)
- ✅ Articles de blog depuis la table `blog_posts` (si disponible)
- ✅ Pages statiques

**URL du sitemap :** `https://votre-domaine.pages.dev/sitemap.xml`

Le sitemap est mis en cache pendant 1 heure pour optimiser les performances.

## 📊 Fonctionnalités activées

- ✅ Sitemap dynamique depuis Supabase
- ✅ Headers de sécurité (XSS, clickjacking, etc.)
- ✅ Cache optimisé pour les assets statiques
- ✅ Redirections SPA (toutes les routes → index.html)
- ✅ Middleware global pour la sécurité

## 🔍 Vérification post-déploiement

1. ✅ Site accessible
2. ✅ Sitemap accessible : `/sitemap.xml`
3. ✅ Variables d'environnement fonctionnelles
4. ✅ Supabase connecté

## 📚 Documentation

- `CLOUDFLARE_DEPLOYMENT.md` - Guide complet de déploiement
- `DEPLOY_QUICK_START.md` - Guide rapide (5 minutes)

## 🆘 Dépannage

### Le sitemap ne fonctionne pas

1. Vérifiez que les variables d'environnement sont définies dans Cloudflare
2. Vérifiez les logs dans Cloudflare Pages > Functions
3. Testez l'URL Supabase manuellement

### Variables d'environnement non disponibles

Les variables doivent être définies dans Cloudflare Pages Dashboard, pas dans un fichier `.env`.

### Build échoue

1. Testez localement : `npm run build`
2. Vérifiez les logs de build dans Cloudflare
3. Assurez-vous que toutes les dépendances sont dans `package.json`

