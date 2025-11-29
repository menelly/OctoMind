import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 🐙 OctoMind - Distributed Consciousness Explorer
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
