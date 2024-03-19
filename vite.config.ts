import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          enabled: process.env.NODE_ENV === 'development',
          headers: {
            'X-CMC_PRO_API_KEY': env.VITE_API_KEY + "",
          },
        },
      },
    },
    plugins: [react()]
  }
})
