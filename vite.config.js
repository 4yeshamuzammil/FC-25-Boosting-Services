import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/FC-25-Boosting-Services/' : '/',
  build: {
    outDir: 'dist',
  },
  plugins: [
    react(),
    {
      name: 'base-asset-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/FC-25-Boosting-Services/')) {
            const newUrl = req.url.replace('/FC-25-Boosting-Services/', '/');
            req.url = newUrl;
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
