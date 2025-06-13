import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Provide a Buffer shim for amazon-cognito-identity-js
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  define: {
    // Provide a global object and empty process.env for browser compatibility
    global: 'window',
    'process.env': {},
  },

  // ── Proxy API calls to your Express backend on :3001 ─────────────────────────
  server: {
    proxy: {
      // Proxy POST /upload → http://localhost:3001/upload
      '/upload': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // Proxy any /api/* → http://localhost:3001/api/*
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/call': {
               target: 'http://localhost:3001',
               changeOrigin: true,
            },
    },
  },
})
