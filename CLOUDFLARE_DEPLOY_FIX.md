# 🔧 Correction de la commande de déploiement Cloudflare Pages

## Problème

La commande de déploiement `npx wrangler deploy` échoue car :
- Wrangler est conçu pour déployer des **Workers**, pas des **Pages**
- Cloudflare Pages **déploie automatiquement** après un build réussi
- La "Deploy command" n'est **pas nécessaire** pour Cloudflare Pages

## ✅ Solution

### Supprimez la commande de déploiement

Dans Cloudflare Pages, **laissez le champ "Deploy command" VIDE**.

Cloudflare Pages déploie automatiquement le contenu du dossier `dist` après un build réussi.

## Configuration finale

| Paramètre | Valeur |
|-----------|--------|
| **Root directory** | `notary-site` |
| **Build command** | `cd notary-site && npm install --legacy-peer-deps && npm run build` |
| **Deploy command** | *(laisser vide)* |
| **Build output directory** | `dist` |

## Comment ça fonctionne

1. Cloudflare Pages clone le dépôt
2. Exécute la commande de build
3. **Déploie automatiquement** le contenu de `dist/`
4. Les fonctions dans `functions/` sont automatiquement déployées comme Edge Functions

Aucune commande de déploiement n'est nécessaire !

