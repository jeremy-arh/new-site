import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
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
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'icons': ['@iconify/react'],
          'helmet': ['react-helmet-async']
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
