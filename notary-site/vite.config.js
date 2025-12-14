import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
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
    }),
  ],
  build: {
    // Terser pour une minification MAXIMALE
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // Supprimer tous les console.log
        drop_debugger: true,     // Supprimer les debugger
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3,               // 3 passes de compression
        unsafe: true,            // Optimisations agressives
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
        dead_code: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        hoist_vars: false,
        if_return: true,
        join_vars: true,
        side_effects: true,
        collapse_vars: true,
        reduce_vars: true,
        reduce_funcs: true,
        inline: true,
        ecma: 2020,
      },
      mangle: {
        safari10: true,
        toplevel: true,
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
        ecma: 2020,
        ascii_only: true,
      },
    },
    // CSS minification native
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
        // Noms courts pour réduire la taille
        entryFileNames: 'js/[hash].js',
        chunkFileNames: 'js/[hash].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop();
          if (/css/i.test(ext)) return 'css/[hash].[ext]';
          if (/png|jpe?g|svg|gif|webp|avif/i.test(ext)) return 'img/[hash].[ext]';
          if (/woff2?|eot|ttf|otf/i.test(ext)) return 'fonts/[hash].[ext]';
          return 'assets/[hash].[ext]';
        },
        compact: true,
      },
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    chunkSizeWarningLimit: 500,
    target: 'es2020',
    assetsInlineLimit: 8192,
    reportCompressedSize: true,
    modulePreload: { polyfill: false },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: { target: 'es2020' },
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
  esbuild: {
    target: 'es2020',
    legalComments: 'none',
    treeShaking: true,
  },
})
