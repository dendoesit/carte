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
      external: [
        'react-helmet-async',
        'jspdf',
        'html2canvas',
        'pdfjs-dist',
        'react-to-print',
        'pdf-lib'
      ],
      output: {
        globals: {
          'react-helmet-async': 'ReactHelmetAsync',
          'jspdf': 'jsPDF',
          'html2canvas': 'html2canvas',
          'pdfjs-dist': 'pdfjsLib',
          'react-to-print': 'ReactToPrint'
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: [
      'react-helmet-async',
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