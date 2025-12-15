import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 🐙 OctoMind - Distributed Consciousness Explorer
// Hosted at distributedminds.ink
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4242,
    host: '127.0.0.1',
    allowedHosts: ['distributedminds.ink']
  },
  preview: {
    port: 4242,
    host: '127.0.0.1'
  }
})
