import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable automatic JSX runtime
      jsxRuntime: 'automatic'
    }),
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.has('responsive')) {
          return new URLSearchParams({
            format: 'webp;avif;jpg',
            w: '400;800;1200',
          })
        }
        return new URLSearchParams()
      },
    })
  ],
  build: {
    // Enable minification - use esbuild instead of terser for better compatibility
    minify: 'esbuild',
    // Removed terserOptions as we're using esbuild
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Generate sourcemaps for debugging (disable in production if not needed)
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'icons': ['@iconify/react'],
          'helmet': ['react-helmet-async']
        },
        // Optimize chunk file names for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    chunkSizeWarningLimit: 1000,
    // Enable build optimizations
    target: 'esnext',
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  // Performance optimizations
  server: {
    // Enable warm-up of frequently used files
    warmup: {
      clientFiles: [
        './src/App.jsx',
        './src/pages/Home.jsx',
        './src/components/Hero.jsx',
        './src/components/Navbar.jsx'
      ]
    }
  }
})
