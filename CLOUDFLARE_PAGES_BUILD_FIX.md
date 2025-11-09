# 🔧 Correction de la commande de build Cloudflare Pages

## Problème

L'erreur `can't cd to notary-site` se produit car :
- Cloudflare Pages installe les dépendances à la racine du dépôt
- Mais le `package.json` est dans `notary-site/`
- La commande de build essaie de faire `cd notary-site` mais échoue

## ✅ Solution

Quand le **Root directory** est configuré à `notary-site` dans Cloudflare Pages, la commande de build est **déjà exécutée depuis ce répertoire**. Il ne faut donc **PAS** faire `cd notary-site` dans la commande.

### Configuration dans Cloudflare Pages

| Paramètre | Valeur |
|-----------|--------|
| **Root directory** | `notary-site` |
| **Build command** | `npm install --legacy-peer-deps && npm run build` |
| **Build output directory** | `dist` |
| **Framework preset** | `Vite` (ou None) |

### Explication

1. Cloudflare Pages clone le dépôt
2. Change automatiquement dans le **Root directory** (`notary-site`)
3. Installe les dépendances (mais peut-être pas avec `--legacy-peer-deps`)
4. Exécute la commande de build **depuis `notary-site/`**

Donc la commande de build doit être exécutée **sans `cd`** car on est déjà dans le bon répertoire.

### Alternative : Si l'installation automatique échoue

Si Cloudflare Pages n'installe pas correctement les dépendances dans le Root directory, utilisez :

**Build command :**
```
npm install --legacy-peer-deps && npm run build
```

Cela installera les dépendances et builder le projet depuis le Root directory.

## Vérification

Après avoir modifié la configuration :
1. Sauvegardez dans Cloudflare Pages
2. Redéployez le projet
3. Vérifiez les logs pour confirmer que le build fonctionne

