# 🔧 Correction du problème de déploiement Cloudflare Pages

## Problème identifié

Cloudflare Pages cherche le `package.json` à la racine du dépôt, mais le projet `my-notary-form` est dans un sous-dossier.

**Erreur :**
```
npm error path /opt/buildhome/repo/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

## ✅ Solution

### Configuration dans Cloudflare Pages Dashboard

1. **Allez dans votre projet Cloudflare Pages**
2. **Cliquez sur "Settings" > "Builds & deployments"**
3. **Configurez les paramètres suivants :**

   - **Root directory** : `my-notary-form` ⚠️ **IMPORTANT**
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Framework preset** : `Vite` (ou laisser vide)

### Configuration détaillée

| Paramètre | Valeur |
|-----------|--------|
| **Root directory** | `my-notary-form` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Node version** | `18` ou `20` |

### Variables d'environnement

N'oubliez pas d'ajouter les variables d'environnement dans **Settings** > **Environment Variables** :

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | URL de votre projet Supabase |
| `SUPABASE_ANON_KEY` | Clé anonyme Supabase |

## 📝 Note importante

Puisque le projet est dans un sous-dossier `my-notary-form`, les chemins relatifs dans les fonctions Cloudflare Pages Functions doivent être ajustés si nécessaire. Les fichiers dans `my-notary-form/functions/` seront automatiquement déployés comme fonctions Edge.

## 🔄 Après la modification

1. Sauvegardez les changements dans Cloudflare Pages
2. Déclenchez un nouveau déploiement (ou poussez un nouveau commit)
3. Vérifiez que le build fonctionne correctement

## ✅ Vérification

Le build devrait maintenant :
- ✅ Trouver le `package.json` dans `my-notary-form/`
- ✅ Installer les dépendances
- ✅ Construire le projet
- ✅ Déployer les fichiers depuis `my-notary-form/dist/`
- ✅ Déployer les fonctions depuis `my-notary-form/functions/`

