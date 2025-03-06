import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
    rollupOptions: {
      external: [
        'pdfjs-dist'
      ],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-slot', '@radix-ui/react-tabs', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'pdf-vendor': ['jspdf', 'html2canvas'],
          'icons': ['lucide-react']
        },
        globals: {
          'pdfjs-dist': 'pdfjsLib'
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'jspdf',
      'html2canvas'
    ],
    exclude: ['pdfjs-dist']
  },
  server: {
    port: 3000
  }
}) 