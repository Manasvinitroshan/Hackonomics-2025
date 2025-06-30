import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
  server: {
    proxy: {
      // Proxy any /api/* → http://localhost:3001/api/*
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      // Proxy /upload → http://localhost:3001/upload
      '/upload': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      // (Optional) if you ever fetch '/call' directly
      '/call': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
