import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Critters from 'critters'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

// Plugin personnalisé pour inliner le CSS critique après le build
const criticalCssPlugin = () => ({
  name: 'critical-css',
  closeBundle: async () => {
    const distPath = 'dist'
    const critters = new Critters({
      path: distPath,
      preload: 'swap',
      inlineFonts: false,
      pruneSource: false,
      reduceInlineStyles: true,
    })
    
    // Trouver tous les fichiers HTML
    const htmlFiles = readdirSync(distPath).filter(f => f.endsWith('.html'))
    
    for (const file of htmlFiles) {
      const filePath = join(distPath, file)
      const html = readFileSync(filePath, 'utf-8')
      const result = await critters.process(html)
      writeFileSync(filePath, result)
      console.log(`✅ Critical CSS inlined for ${file}`)
    }
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    criticalCssPlugin(),
  ],
  build: {
    // Terser pour minification (sans options unsafe qui cassent React)
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // Supprimer console.log en prod
        drop_debugger: true,     // Supprimer debugger
        dead_code: true,         // Supprimer le code mort
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        if_return: true,
        join_vars: true,
        collapse_vars: true,
        reduce_vars: true,
        // PAS de unsafe* - ça casse React !
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    cssMinify: true,
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks séparés pour optimiser le cache
          if (id.includes('node_modules')) {
            // React et React Router ensemble (souvent utilisés ensemble)
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Supabase seulement si importé directement (sinon lazy-loaded)
            if (id.includes('@supabase/supabase-js')) {
              return 'supabase';
            }
            // Iconify séparé (pas toujours nécessaire)
            if (id.includes('@iconify')) {
              return 'icons';
            }
            // React Helmet séparé
            if (id.includes('react-helmet')) {
              return 'helmet';
            }
            // Autres node_modules
            return 'vendor';
          }
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 500,
    target: 'es2020',
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    warmup: {
      clientFiles: [
        './src/App.jsx',
        './src/pages/Home.jsx',
        './src/components/Hero.jsx',
        './src/components/Navbar.jsx'
      ]
    }
  },
})
