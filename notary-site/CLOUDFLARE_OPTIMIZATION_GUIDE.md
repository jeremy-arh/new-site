# 🚀 Guide d'Optimisation Cloudflare Pages

## 📊 Vérifications à Effectuer

### 1. Vérifier la Configuration Cloudflare

#### Dans Cloudflare Dashboard

1. **Speed > Optimization**
   - Allez dans votre domaine Cloudflare
   - Cliquez sur **Speed** > **Optimization**
   - Vérifiez les paramètres suivants :
     - ✅ **Auto Minify** : HTML, CSS, JavaScript activés
     - ✅ **Brotli** : Activé automatiquement
     - ✅ **Early Hints** : Activé (si disponible)
     - ❌ **Rocket Loader** : Désactivé (peut causer des problèmes avec React)
     - ✅ **Mirage** : Activé (optimisation d'images)
     - ✅ **Polish** : Activé (optimisation d'images automatique)
     - ✅ **WebP** : Activé automatiquement

2. **Caching > Configuration**
   - Allez dans **Caching** > **Configuration**
   - Vérifiez :
     - ✅ **Caching Level** : Standard
     - ✅ **Browser Cache TTL** : Respecter les headers existants
     - ✅ **Always Online** : Activé
     - ✅ **Development Mode** : Désactivé (en production)

3. **SSL/TLS**
   - Allez dans **SSL/TLS**
   - Vérifiez :
     - ✅ **Encryption mode** : Full (strict)
     - ✅ **Always Use HTTPS** : Activé
     - ✅ **Minimum TLS Version** : 1.2
     - ✅ **Opportunistic Encryption** : Activé
     - ✅ **TLS 1.3** : Activé

4. **Security > WAF**
   - Allez dans **Security** > **WAF**
   - Vérifiez :
     - ✅ **Web Application Firewall** : Activé (plan payant)
     - ✅ **Bot Fight Mode** : Activé (plan gratuit)
     - ✅ **Rate Limiting** : Configuré

### 2. Vérifier les Headers HTTP

#### Test des Headers

Utilisez curl ou un outil en ligne pour vérifier les headers :

```bash
curl -I https://mynotary.io
```

Vérifiez que les headers suivants sont présents :
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Cache-Control: public, max-age=31536000, immutable` (pour les assets)

### 3. Vérifier les Performances

#### Outils de Test

1. **PageSpeed Insights**
   - Allez sur https://pagespeed.web.dev/
   - Entrez `https://mynotary.io`
   - Vérifiez les Core Web Vitals :
     - LCP < 2.5s
     - FID < 100ms
     - CLS < 0.1

2. **WebPageTest**
   - Allez sur https://www.webpagetest.org/
   - Testez `https://mynotary.io`
   - Vérifiez :
     - Temps de chargement
     - Nombre de requêtes
     - Taille des assets

3. **Lighthouse**
   - Ouvrez Chrome DevTools (F12)
   - Allez dans l'onglet **Lighthouse**
   - Lancez un audit
   - Vérifiez les scores :
     - Performance > 90
     - Accessibility > 90
     - Best Practices > 90
     - SEO > 90

### 4. Vérifier le Cache

#### Test du Cache

1. **Premier chargement**
   - Ouvrez le site en navigation privée
   - Vérifiez le temps de chargement

2. **Chargement suivant**
   - Rechargez la page (F5)
   - Vérifiez que les assets sont en cache (dans Network tab)
   - Vérifiez que le temps de chargement est réduit

3. **Vérifier les headers de cache**
   - Ouvrez Chrome DevTools > Network
   - Rechargez la page
   - Vérifiez les headers `Cache-Control` pour chaque asset

### 5. Vérifier les Fonctions Edge

#### Test du Sitemap

1. **Accéder au sitemap**
   - Allez sur `https://mynotary.io/sitemap.xml`
   - Vérifiez que le sitemap s'affiche correctement
   - Vérifiez que les URLs sont correctes

2. **Vérifier le cache**
   - Vérifiez les headers `Cache-Control`
   - Vérifiez que le cache est de 1 heure

### 6. Vérifier les Variables d'Environnement

#### Dans Cloudflare Pages

1. **Vérifier les variables**
   - Allez dans **Settings** > **Environment variables**
   - Vérifiez que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont configurés
   - Vérifiez qu'elles sont activées pour **Production**

2. **Tester les variables**
   - Ouvrez la console du navigateur (F12)
   - Vérifiez qu'il n'y a pas d'erreur Supabase
   - Vérifiez que les données se chargent correctement

## 🎯 Optimisations Recommandées

### 1. Activer Cloudflare Web Analytics

1. Allez dans **Analytics** > **Web Analytics**
2. Cliquez sur **Add a site**
3. Entrez `mynotary.io`
4. Copiez le script et ajoutez-le dans votre site (optionnel, Cloudflare le fait automatiquement)

### 2. Configurer les Rules

1. Allez dans **Rules** > **Page Rules**
2. Créez des règles pour :
   - Cache les assets statiques agressivement
   - Forcer HTTPS
   - Rediriger www vers non-www (ou vice versa)

### 3. Optimiser les Images

1. **Utiliser WebP/AVIF**
   - Vérifiez que `vite-imagetools` génère des formats modernes
   - Vérifiez que les images sont optimisées

2. **Lazy Loading**
   - Vérifiez que `loading="lazy"` est présent sur les images non critiques
   - Vérifiez que les images critiques sont chargées en priorité

### 4. Optimiser les Fonts

1. **Preload les fonts critiques**
   - Vérifiez que les fonts sont préchargées dans `index.html`
   - Vérifiez que `font-display: swap` est configuré

2. **Self-hosted fonts** (optionnel)
   - Considérez héberger les fonts localement pour de meilleures performances
   - Utilisez `@font-face` avec `font-display: swap`

## 📈 Monitoring

### 1. Cloudflare Analytics

- **Web Analytics** : Activé pour voir les statistiques de trafic
- **Analytics** : Activé dans le dashboard pour voir les métriques détaillées

### 2. Real User Monitoring (RUM)

- **Cloudflare RUM** : Activé (si disponible)
- **Performance Monitoring** : Configuré pour voir les Core Web Vitals

### 3. Error Tracking

- **Workers Logs** : Activé pour voir les erreurs des fonctions Edge
- **Console Errors** : Surveillé régulièrement

## 🔧 Commandes Utiles

### Vérifier la Configuration

```bash
# Vérifier les headers
curl -I https://mynotary.io

# Vérifier le sitemap
curl https://mynotary.io/sitemap.xml

# Vérifier les performances
npx lighthouse https://mynotary.io --view
```

### Test Local

```bash
# Build local
cd notary-site
npm install --legacy-peer-deps
npm run build

# Vérifier la taille
du -sh dist/

# Prévisualiser
npm run preview
```

## ✅ Checklist Rapide

- [ ] Auto Minify activé (HTML, CSS, JS)
- [ ] Brotli activé
- [ ] SSL/TLS en mode Full (strict)
- [ ] Headers de sécurité configurés
- [ ] Cache configuré correctement
- [ ] Variables d'environnement configurées
- [ ] Sitemap fonctionnel
- [ ] Performance > 90 (Lighthouse)
- [ ] Core Web Vitals optimaux
- [ ] Images optimisées (WebP, AVIF)
- [ ] Fonts optimisées (preload, swap)
- [ ] Analytics activé
- [ ] Monitoring configuré

## 🆘 Dépannage

### Performance faible

1. Vérifiez la taille du bundle JavaScript
2. Vérifiez le nombre de requêtes
3. Vérifiez la taille des images
4. Vérifiez les fonts (trop de fonts peuvent ralentir)

### Erreurs de chargement

1. Vérifiez les variables d'environnement
2. Vérifiez les logs Cloudflare
3. Vérifiez la console du navigateur
4. Vérifiez les CORS (si applicable)

### Cache ne fonctionne pas

1. Vérifiez les headers `Cache-Control`
2. Vérifiez la configuration Cloudflare
3. Vérifiez que les assets ont des noms uniques (hash)

