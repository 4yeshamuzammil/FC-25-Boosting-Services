import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/FC-25-Boosting-Services/',
  plugins: [
    react(),
    {
      name: 'base-asset-fallback',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url && (req.url.startsWith('/images/') || req.url === '/favicon.svg')) {
            req.url = '/FC-25-Boosting-Services' + req.url;
          }
          next();
        });
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5268',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
