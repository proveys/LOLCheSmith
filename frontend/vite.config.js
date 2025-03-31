import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:80', // 백엔드 포트 (스프링부트)
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
