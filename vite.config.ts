import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { resolve } from 'path';
import { spawn } from 'child_process';

let backendStarted = false;

function startBackendPlugin() {
  return {
    name: 'start-backend',
    configureServer() {
      if (backendStarted) return;
      backendStarted = true;

      const serverEntry = resolve(__dirname, 'server/src/index.js');
      const backend = spawn('node', [serverEntry], {
        cwd: resolve(__dirname, 'server'),
        stdio: 'inherit',
        detached: false,
      });

      backend.on('error', (err) => {
        console.error('[Backend] 启动失败:', err.message);
      });

      backend.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          console.error(`[Backend] 进程退出，exit code ${code}`);
        }
      });

      console.log('[Backend] 正在启动，请稍候...');
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    startBackendPlugin(),
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
