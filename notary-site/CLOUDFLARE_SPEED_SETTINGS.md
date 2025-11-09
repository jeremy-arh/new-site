# ⚡ Configuration Cloudflare Speed Settings

## 🔧 Paramètres à Configurer dans Cloudflare Dashboard

### 1. Speed > Optimization

Allez dans votre domaine Cloudflare > **Speed** > **Optimization**

#### Auto Minify
- ✅ **JavaScript** : Activé
- ✅ **CSS** : Activé
- ✅ **HTML** : Activé

#### Polish
- ✅ **Polish** : Activé (optimise automatiquement les images)
- ✅ **WebP** : Activé automatiquement

#### Mirage
- ✅ **Mirage** : Activé (optimise les images pour mobile)

#### Early Hints
- ✅ **Early Hints** : Activé (si disponible)

#### Rocket Loader
- ❌ **Rocket Loader** : Désactivé (peut causer des problèmes avec React)

### 2. Caching > Configuration

Allez dans **Caching** > **Configuration**

#### Caching Level
- ✅ **Caching Level** : Standard

#### Browser Cache TTL
- ✅ **Browser Cache TTL** : Respecter les headers existants

#### Always Online
- ✅ **Always Online** : Activé

#### Development Mode
- ❌ **Development Mode** : Désactivé (en production)

### 3. SSL/TLS

Allez dans **SSL/TLS**

#### Encryption Mode
- ✅ **Encryption mode** : Full (strict)

#### Always Use HTTPS
- ✅ **Always Use HTTPS** : Activé

#### Minimum TLS Version
- ✅ **Minimum TLS Version** : 1.2

#### Opportunistic Encryption
- ✅ **Opportunistic Encryption** : Activé

#### TLS 1.3
- ✅ **TLS 1.3** : Activé

### 4. Speed > Optimization > Early Hints

- ✅ **Early Hints** : Activé (précharge les ressources critiques)

## 📊 Vérifications

### Test des Headers

```bash
curl -I https://mynotary.io
```

Vérifiez que vous voyez :
- `cf-cache-status: HIT` (pour les assets en cache)
- `cf-ray: ...` (présent sur toutes les requêtes)
- Headers de sécurité (X-Content-Type-Options, etc.)

### Test de Performance

1. **PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Entrez `https://mynotary.io`
   - Vérifiez les Core Web Vitals

2. **WebPageTest**
   - https://www.webpagetest.org/
   - Testez `https://mynotary.io`
   - Vérifiez les métriques de performance

3. **Lighthouse**
   - Chrome DevTools > Lighthouse
   - Lancez un audit
   - Vérifiez les scores

## 🎯 Objectifs de Performance

- **Lighthouse Performance** : > 90
- **LCP (Largest Contentful Paint)** : < 2.5s
- **FID (First Input Delay)** : < 100ms
- **CLS (Cumulative Layout Shift)** : < 0.1
- **FCP (First Contentful Paint)** : < 1.8s
- **TTI (Time to Interactive)** : < 3.8s

## 🔍 Monitoring

### Cloudflare Analytics

1. Allez dans **Analytics** > **Web Analytics**
2. Activez Web Analytics pour `mynotary.io`
3. Consultez les métriques de performance

### Real User Monitoring (RUM)

1. Allez dans **Analytics** > **RUM**
2. Activez RUM (si disponible)
3. Surveillez les Core Web Vitals en temps réel

## ✅ Checklist

- [ ] Auto Minify activé (HTML, CSS, JS)
- [ ] Polish activé
- [ ] Mirage activé
- [ ] Early Hints activé
- [ ] Rocket Loader désactivé
- [ ] SSL/TLS en mode Full (strict)
- [ ] Always Use HTTPS activé
- [ ] Cache configuré correctement
- [ ] Performance > 90 (Lighthouse)
- [ ] Core Web Vitals optimaux
- [ ] Analytics activé
- [ ] Monitoring configuré

