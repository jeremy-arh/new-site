# Notary Site - React + Tailwind CSS

Ce projet est une recréation fidèle du site web Notary en utilisant React et Tailwind CSS.

## 📋 Fonctionnalités

- ✅ Navbar responsive avec menu mobile et dropdown
- ✅ Section Hero avec design moderne
- ✅ Section Services avec cartes interactives
- ✅ Section "How it works" avec sidebar sticky
- ✅ Section Témoignage client
- ✅ FAQ avec accordéon interactif
- ✅ Footer complet avec liens
- ✅ Design 100% responsive (mobile, tablette, desktop)
- ✅ Animations et transitions fluides

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
```

### Aperçu de la production

```bash
npm run preview
```

## 🛠️ Technologies utilisées

- **React 18** - Framework JavaScript
- **Vite** - Build tool et dev server ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **PostCSS** - Transformations CSS
- **Autoprefixer** - Préfixes CSS automatiques

## 📁 Structure du projet

```
notary-site/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Barre de navigation
│   │   ├── Hero.jsx          # Section hero
│   │   ├── Services.jsx      # Section services
│   │   ├── HowItWorks.jsx    # Section "Comment ça marche"
│   │   ├── Testimonial.jsx   # Section témoignage
│   │   ├── FAQ.jsx           # Section FAQ avec accordéon
│   │   └── Footer.jsx        # Pied de page
│   ├── App.jsx              # Composant principal
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Styles Tailwind
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎨 Personnalisation

### Couleurs

Les couleurs peuvent être modifiées dans `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      'primary': '#1a1a1a',
      'accent': '#4a90e2',
    },
  },
}
```

### Police

La police Inter est utilisée par défaut. Pour utiliser TASA Orbiter (comme dans l'original), vous devez avoir accès à cette police commerciale.

## 📱 Responsive Design

Le site est entièrement responsive et optimisé pour:
- 📱 Mobile (< 768px)
- 📱 Tablette (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🔗 Liens utiles

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📝 Notes

Ce site est une recréation fidèle du design original Webflow, avec toutes les fonctionnalités interactives implémentées en React.

Toutes les images et icônes utilisent les URLs originales du CDN Webflow.
