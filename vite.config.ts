import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false
    })
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'date-utils': ['date-fns'],
          'icons': ['lucide-react'],
          'auth': ['@supabase/supabase-js'],
          'security': ['dompurify', 'express-rate-limit', 'zod']
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'date-fns',
      'lucide-react',
      '@supabase/supabase-js'
    ],
    exclude: ['./src/test']
  }
});