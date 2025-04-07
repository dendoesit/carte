import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { UserConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 0,
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: [
      'pdf-lib',
      'jspdf',
      'html2canvas',
      'pdfjs-dist',
      'react-to-print',
      'react-pdf'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  server: {
    port: 3000
  },
  assetsInclude: ['**/*.svg', '**/*.pdf'],
} as UserConfig) 