import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  // Relative assets and hash routing work both locally and under /odoo_test/ on GitHub Pages.
  base: './',
  plugins: [react(), tailwindcss()], server: { host: '0.0.0.0', port: 5173, allowedHosts: true, watch: { ignored: ['**/artifacts/**', '**/docs/**', '**/tests/**'] } }, build: { chunkSizeWarningLimit: 4000, rollupOptions: { output: { manualChunks(id) { if (id.includes('/src/data/bank/questions.json')) return 'question-bank'; if (id.includes('/node_modules/recharts/') || id.includes('/node_modules/d3-') || id.includes('/node_modules/victory-vendor/')) return 'charts'; } } } }, test: { include: ['tests/**/*.test.ts'] } });
