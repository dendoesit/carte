import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// No longer need fileURLToPath or url module for this approach
import type { UserConfig } from 'vite'

// Resolve path relative to the project root (process.cwd())
// This assumes 'bun run build' is executed from the project root directory
const workerFilePath = path.resolve( 
  'node_modules', 
  'pdfjs-dist', 
  'build', 
  'pdf.worker.mjs' 
);

// Log the path Vite config is calculating
console.log(`[vite.config.ts] Calculated worker source path: ${workerFilePath}`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      // Resolve alias relative to CWD as well
      '@': path.resolve('src'), 
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
        globals: {},
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