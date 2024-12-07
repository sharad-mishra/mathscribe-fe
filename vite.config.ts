// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/calculate': {
        target: 'http://localhost:8900',
        changeOrigin: true,
        secure: false,
        // Ensure the path remains '/calculate' when proxied
        // Remove or comment out the rewrite if present
        // rewrite: (path) => path.replace(/^\/calculate/, ''),
      },
    },
  },
});