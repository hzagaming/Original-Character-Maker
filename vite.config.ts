import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-404-for-oss',
      closeBundle() {
        try {
          copyFileSync(resolve(__dirname, 'dist/index.html'), resolve(__dirname, 'dist/404.html'));
          console.log('[generate-404-for-oss] dist/404.html created');
        } catch (e) {
          console.warn('[generate-404-for-oss] failed to create 404.html:', e);
        }
      },
    },
  ],
});
