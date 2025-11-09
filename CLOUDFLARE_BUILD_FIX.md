# 🔧 Correction de la commande de build Cloudflare Pages

## Problème

Cloudflare Pages cherche le `package.json` à la racine au lieu de `notary-site/`, même si le Root directory est configuré.

## ✅ Solution

Modifiez la **Build command** dans Cloudflare Pages pour qu'elle change de répertoire d'abord :

### Commande de build à utiliser :

```bash
cd notary-site && npm install --legacy-peer-deps && npm run build
```

### Ou si vous avez déjà installé les dépendances :

```bash
cd notary-site && npm run build
```

## Configuration complète dans Cloudflare Pages

| Paramètre | Valeur |
|-----------|--------|
| **Root directory** | `notary-site` |
| **Build command** | `cd notary-site && npm install --legacy-peer-deps && npm run build` |
| **Build output directory** | `dist` |

## Note

Le fichier `.npmrc` a été créé dans `notary-site/` pour gérer automatiquement les conflits de dépendances avec `--legacy-peer-deps`.

