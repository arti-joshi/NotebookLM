import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: process.env.VITE_API_URL || 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
      '/files': {
        target: process.env.VITE_API_URL || 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
      '/notes': {
        target: process.env.VITE_API_URL || 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
      '/embeddings': {
        target: process.env.VITE_API_URL || 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
      '/documents': {
        target: process.env.VITE_API_URL || 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
      '/processing': {
        target: process.env.VITE_API_URL || 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
      '/ai': {
        target: process.env.VITE_API_URL || 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
      '/progress': {
        target: process.env.VITE_API_URL || 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
      '/rag': {
        target: process.env.VITE_API_URL || 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
