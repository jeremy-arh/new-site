# 🔧 Commande de déploiement Cloudflare Pages

## Problème

Le champ "Deploy command" est obligatoire dans Cloudflare Pages, mais Cloudflare Pages déploie automatiquement le contenu de `dist/` après un build réussi.

## ✅ Solution

Utilisez une commande simple qui ne fait rien mais qui réussit :

### Commande de déploiement à utiliser :

```bash
echo "Deployment completed - Cloudflare Pages will deploy automatically"
```

### Ou encore plus simple :

```bash
true
```

## Configuration complète

| Paramètre | Valeur |
|-----------|--------|
| **Root directory** | `notary-site` |
| **Build command** | `cd notary-site && npm install --legacy-peer-deps && npm run build` |
| **Deploy command** | `echo "Deployment completed"` |
| **Build output directory** | `dist` |

## Comment ça fonctionne

1. Cloudflare Pages exécute la commande de build
2. Le build génère les fichiers dans `notary-site/dist/`
3. Cloudflare Pages exécute la commande de déploiement (qui ne fait rien mais réussit)
4. **Cloudflare Pages déploie automatiquement** le contenu de `dist/`
5. Les fonctions dans `functions/` sont automatiquement déployées comme Edge Functions

## Note

La commande de déploiement est juste un placeholder pour satisfaire l'obligation du champ. Le vrai déploiement se fait automatiquement par Cloudflare Pages après le build.

