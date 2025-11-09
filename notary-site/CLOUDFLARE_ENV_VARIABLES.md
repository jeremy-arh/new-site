# 🔧 Configuration des Variables d'Environnement Cloudflare Pages

## Problème

L'erreur `Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL` indique que les variables d'environnement Supabase ne sont pas configurées dans Cloudflare Pages.

## ✅ Solution : Ajouter les Variables d'Environnement

### Étape 1 : Obtenir vos identifiants Supabase

1. Allez sur [Supabase Dashboard](https://app.supabase.com/)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (la clé publique)

### Étape 2 : Ajouter les Variables dans Cloudflare Pages

1. **Allez dans votre projet Cloudflare Pages**
   - Dashboard Cloudflare → Workers & Pages → Pages
   - Cliquez sur votre projet

2. **Ouvrez les paramètres**
   - Cliquez sur **Settings** (en haut)
   - Cliquez sur **Environment variables** (dans le menu de gauche)

3. **Ajoutez les variables pour Production**
   - Cliquez sur **Add variable** (ou le bouton **+**)
   - **Variable name** : `VITE_SUPABASE_URL`
   - **Value** : Votre URL Supabase (ex: `https://xxxxx.supabase.co`)
   - Sélectionnez **Production** (et **Preview** si vous voulez)
   - Cliquez sur **Save**

4. **Ajoutez la deuxième variable**
   - Cliquez sur **Add variable** à nouveau
   - **Variable name** : `VITE_SUPABASE_ANON_KEY`
   - **Value** : Votre clé anonyme Supabase
   - Sélectionnez **Production** (et **Preview** si vous voulez)
   - Cliquez sur **Save**

### Étape 3 : Redéployer

1. Après avoir ajouté les variables, **redéployez votre projet**
   - Allez dans **Deployments**
   - Cliquez sur le bouton **Retry deployment** sur le dernier déploiement
   - Ou faites un nouveau commit pour déclencher un nouveau déploiement

## Configuration Finale

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | `votre_clé_anonyme` | Production, Preview |

## ⚠️ Important

- **Préfixe `VITE_`** : Les variables doivent commencer par `VITE_` pour être accessibles dans le code côté client avec Vite
- **Redéploiement** : Après avoir ajouté les variables, vous devez redéployer pour qu'elles soient disponibles
- **Sécurité** : Ne commitez JAMAIS ces valeurs dans Git. Utilisez toujours les variables d'environnement Cloudflare Pages

## Vérification

Après le redéploiement, vérifiez que :
1. ✅ Le site se charge correctement
2. ✅ Les données Supabase se chargent (services, articles de blog)
3. ✅ Aucune erreur dans la console du navigateur

## Dépannage

### Les variables ne fonctionnent pas après le redéploiement

1. Vérifiez que les noms des variables sont exactement : `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
2. Vérifiez que les valeurs sont correctes (URL complète avec `https://`)
3. Vérifiez que les variables sont activées pour **Production**
4. Redéployez le projet après avoir ajouté les variables

### L'erreur persiste

1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs
3. Vérifiez que les variables sont bien présentes dans le code buildé (elles devraient être remplacées par leurs valeurs)

