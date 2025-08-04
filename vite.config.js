/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: isProd
          ? 'https://credosafe-server.onrender.com'
          : 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
