import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ plugins: [react(), tailwindcss()], server: { host: '0.0.0.0', port: 5173, allowedHosts: true, watch: { ignored: ['**/artifacts/**', '**/docs/**', '**/tests/**'] } }, build: { chunkSizeWarningLimit: 900 }, test: { include: ['tests/**/*.test.ts'] } });
