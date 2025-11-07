# Déploiement Rapide sur Cloudflare Pages

## Étapes rapides (5 minutes)

### 1. Préparer le projet

```bash
# S'assurer que toutes les dépendances sont installées
npm install
```

### 2. Connecter à Cloudflare Pages

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sélectionnez "Pages" dans le menu latéral
3. Cliquez sur "Create a project"
4. Sélectionnez "Connect to Git"
5. Choisissez votre dépôt GitHub `my-notary-form`

### 3. Configurer le build

Dans la configuration du projet :

- **Framework preset** : `Vite`
- **Build command** : `npm run build`
- **Build output directory** : `dist`
- **Root directory** : `/` (laisser vide)

### 4. Ajouter les variables d'environnement

Dans **Settings** > **Environment Variables**, ajoutez :

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `VITE_SUPABASE_URL` | Votre URL Supabase | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Votre clé anonyme Supabase | Production, Preview, Development |

**Où trouver ces valeurs :**
- Allez sur [Supabase Dashboard](https://app.supabase.com/)
- Sélectionnez votre projet
- Allez dans **Settings** > **API**
- Copiez l'**URL** et la **anon/public key**

### 5. Déployer

1. Cliquez sur "Save and Deploy"
2. Attendez que le build se termine (2-3 minutes)
3. Votre site sera disponible à : `https://votre-projet.pages.dev`

### 6. Vérifier le sitemap

Une fois déployé, vérifiez que le sitemap fonctionne :
- Visitez : `https://votre-projet.pages.dev/sitemap.xml`
- Vous devriez voir un sitemap XML avec vos pages

## Déploiements automatiques

Après la configuration initiale :
- Chaque `git push` sur la branche `main` déclenchera un nouveau déploiement
- Les pull requests créent automatiquement des previews

## Commandes utiles

```bash
# Build local pour tester
npm run build

# Prévisualiser le build local
npm run preview

# Déployer via Wrangler CLI (optionnel)
npm run deploy:cf
```

## Support

- [Documentation Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Documentation Supabase](https://supabase.com/docs)

