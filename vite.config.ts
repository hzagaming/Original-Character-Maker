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
        // 阿里云 OSS / CDN 静态网站托管需要 404.html 作为回退
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
