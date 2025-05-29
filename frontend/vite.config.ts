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
})